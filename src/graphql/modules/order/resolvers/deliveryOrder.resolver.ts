import { ROLES } from "../../../../constants/role.const";
import { Context } from "../../../context";
import { OrderModel, OrderStatus, ShipMethod } from "../order.model";
import { ErrorHelper } from "../../../../helpers/error.helper";
// import { OrderStatus } from "../../../../constants/model.const";
import {
  VietnamPostHelper,
  AdditionService,
  ServiceCode,
} from "../../../../helpers/vietnamPost/vietnamPost.helper";
import { BranchModel } from "../../branch/branch.model";
import { AddressModel } from "../../address/address.model";
import { privateDecrypt } from "crypto";
import { OrderItemModel } from "../../orderItem/orderItem.model";
import { AddressStorehouseModel } from "../../addressStorehouse/addressStorehouse.model";
import { MemberModel } from "../../member/member.model";
import { CustomerModel } from "../../customer/customer.model";
import { AddressDeliveryModel } from "../../addressDelivery/addressDelivery.model";

const Mutation = {
  deliveryOrder: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ADMIN_EDITOR_MEMBER);
    const { orderId, deliveryInfo } = args;

    const order = await OrderModel.findById(orderId);
    if (!order) throw ErrorHelper.mgRecoredNotFound("Đơn hàng");

    const seller = await MemberModel.findById(context.id);
    if (!seller) throw ErrorHelper.mgRecoredNotFound("chủ shop");

    const buyer = await CustomerModel.findById(order.buyerId);
    if (!buyer) throw ErrorHelper.mgRecoredNotFound("khách hàng");
    // post vận đơn
    //vnpost vận đơn

    // Kiểm tra tình trạng đơn hàng
    if (order.status != OrderStatus.PENDING)
      throw ErrorHelper.cannotEditOrder();

    if (order.shipMethod === ShipMethod.NONE)
      throw ErrorHelper.cannotMatchShipMethod();
    // Chuyển trạng thái đơn hàng
    order.status = OrderStatus.DELIVERING;

    //nếu post vận đơn
    //lấy ra địa chỉ kho chính + addressDeliveryId -> deliveryInfo chạy đơn

    // nếu vnpost vận đơn
    // lấy địa chỉ kho trong delivery info -> deliveryInfo chạy đơn
    
    const store = await AddressStorehouseModel.findById(
      deliveryInfo.addressStorehouseId
    );
    if (!store) throw ErrorHelper.notConnectedInventory();
    const storeAddress = await AddressModel.findOne({ wardId: store.wardId });


    let receiverAddress = null;

    if (order.shipMethod === ShipMethod.POST){
      const addressDelivery = await AddressDeliveryModel.findById(order.addressDeliveryId);
      receiverAddress = await AddressModel.findOne({
        wardId: addressDelivery.wardId,
      });
    }

    if (order.shipMethod === ShipMethod.VNPOST){
      receiverAddress = await AddressModel.findOne({
        wardId: order.buyerWardId,
      });
    }
    
    if(!receiverAddress) 
      throw ErrorHelper.recoredNotFound("địa điểm nhận hàng");

    const VASIds = [];

    deliveryInfo.hasMoneyCollection &&
      VASIds.push(AdditionService.GIAO_HANG_THU_TIEN);
    deliveryInfo.hasReport && VASIds.push(AdditionService.BAO_PHAT);
    deliveryInfo.hasInvoice && VASIds.push(AdditionService.DICH_VU_HOA_DON);

    const data: any = {
      OrderCode: order.code, // mã đơn hàng
      SenderFullname: seller.shopName, // tên người gửi
      SenderAddress: store.address, // địa chỉ gửi
      SenderTel: seller.phone, // phone người gửi
      SenderProvinceId: storeAddress.provinceId, // mã tỉnh người gửi
      SenderDistrictId: storeAddress.districtId, // mã quận người gửi
      SenderWardId: storeAddress.wardId, // mã phường người gửi
      ReceiverFullname: buyer.name, // tên người nhận
      ReceiverAddress: buyer.address, // địa chỉ nhận
      ReceiverTel: buyer.phone, // phone người nhận
      ReceiverProvinceId: receiverAddress.provinceId, // mã tỉnh người nhận
      ReceiverDistrictId: receiverAddress.districtId, // mã quận người nhận
      ReceiverWardId: receiverAddress.wardId, // mã phường người nhận
      CodAmountEvaluation: order.subtotal.toString(), // giá trị tiền thu hộ
      IsPackageViewable: deliveryInfo.isPackageViewable, // cho xem hàng
      IsDeleteDraft: true,
      PackageContent: deliveryInfo.productName, //"Món hàng A + Món hàng B"; // nội dung hàng
      ServiceName: deliveryInfo.serviceId, //"BK"; // tên dịch vụ
      OrderAmountEvaluation: deliveryInfo.showOrderAmount // khai giá lấy giá trị subtotal
        ? order.subtotal.toString()
        : null, // giá trị khai giá
      WeightEvaluation: deliveryInfo.productWeight.toString(), // cân nặng
      WidthEvaluation: deliveryInfo.productWidth.toString(), // chiều rộng
      LengthEvaluation: deliveryInfo.productLength.toString(), // chiều dài
      HeightEvaluation: deliveryInfo.productHeight.toString(), // chiều cao
      VASIds, //[3, 1, 2, 4]; // dịch vụ cộng thêm
      IsReceiverPayFreight: deliveryInfo.hasMoneyCollection, // thu cước người nhận
      CustomerNote: deliveryInfo.note, // yêu cầu khác      
      VendorId: 1, // 1;
      PickupType: 1, //1;
      SenderAddressType: 1,
      ReceiverAddressType: 1,
    };

    const bill = await VietnamPostHelper.createDeliveryOrder(data);

    order.deliveryInfo.orderNumber = bill.orderNumber;
    order.deliveryInfo.partnerFee = bill.moneyTotalFee;
    return await order.save();
  },
};

export default { Mutation };


    // const deliveryInfo = {
    //   isPackageViewable: true, // Có cho xem hàng
    //   hasMoneyCollection: true,
    //   showOrderAmount: true, //khai giá,
    //   hasReport: true, // báo phát
    //   hasInvoice: true, // dịch vụ hóa đơn
    //   note: order.deliveryInfo.note, // ghi chú - yêu cầu khác
    //   serviceId: order.deliveryInfo.serviceId, // servicelist or servicelisst offline
    //   addressStorehouseId: order.deliveryInfo.addressStorehouseId,
    //   productWeight: order.deliveryInfo.productWeight,
    //   productLength: order.deliveryInfo.productLength,
    //   productWidth: order.deliveryInfo.productWidth,
    //   productHeight: order.deliveryInfo.productHeight,
    //   productName: order.deliveryInfo.productName,
    // };