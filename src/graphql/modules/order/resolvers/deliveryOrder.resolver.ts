import { ROLES } from "../../../../constants/role.const";
import { Context } from "../../../context";
import { OrderModel, OrderStatus, ShipMethod } from "../order.model";
import { ErrorHelper } from "../../../../helpers/error.helper";
// import { OrderStatus } from "../../../../constants/model.const";
import { VietnamPostHelper, AdditionService, ServiceCode } from "../../../../helpers/vietnamPost/vietnamPost.helper";
import { BranchModel } from "../../branch/branch.model";
import { AddressModel } from "../../address/address.model";
import { privateDecrypt } from "crypto";
import { OrderItemModel } from "../../orderItem/orderItem.model";
import { AddressStorehouseModel } from "../../addressStorehouse/addressStorehouse.model";
import { MemberModel } from "../../member/member.model";
import { CustomerModel } from "../../customer/customer.model";

const Mutation = {
  deliveryOrder: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ADMIN_EDITOR_MEMBER);
    const { orderId } = args;
    const order = await OrderModel.findById(orderId);
    if (!order) throw ErrorHelper.mgRecoredNotFound("Đơn hàng");


    const seller = await MemberModel.findById(context.id);
    if (!seller) throw ErrorHelper.mgRecoredNotFound("chủ shop");

    const buyer = await CustomerModel.findById(order.buyerId);
    if (!buyer) throw ErrorHelper.mgRecoredNotFound("khách hàng");

    // Kiểm tra tình trạng đơn hàng
    if (order.status != OrderStatus.PENDING) throw ErrorHelper.cannotEditOrder();
    // Chuyển trạng thái đơn hàng
    order.status = OrderStatus.DELIVERING;
    if (order.shipMethod == ShipMethod.VNPOST) {
      const store = await AddressStorehouseModel.findById(order.deliveryInfo.addressStorehouseId);
      if (!store) throw ErrorHelper.NotConnectedInventory();
      const storeAddress = await AddressModel.findOne({ wardId: store.wardId });
      const receiverAddress = await AddressModel.findOne({ wardId: order.buyerWardId });
      const items = await OrderItemModel.find({ orderId: order._id });

      const requestInfo = {
        isPackageViewable:true, // Có cho xem hàng
        showOrderAmount: true, //khai giá,
        hasReport: true, // báo phát
        hasInvonce:true, // dịch vụ hóa đơn
        note: "Hàng dễ vở , xin nhẹ tay", // ghi chú - yêu cầu khác
      }

      const deliveryInfo = {
        ...requestInfo,
        serviceCode : ServiceCode.BK,
        packageContent: items.map((i)=>`[${i.productName} - SL:${i.qty}]`).join(' '),
      };

      const VASIds = [
        AdditionService.GIAO_HANG_THU_TIEN,
      ]

      deliveryInfo.hasReport && VASIds.push(AdditionService.BAO_PHAT);
      deliveryInfo.hasInvonce && VASIds.push(AdditionService.DICH_VU_HOA_DON);

      const data:any = {
        OrderCode: order.code, // mã đơn hàng
        VendorId: 1, // 1;
        PickupType: 1, //1;
        IsPackageViewable: deliveryInfo.isPackageViewable, // cho xem hàng
        IsDeleteDraft: true,
        PackageContent: deliveryInfo.packageContent, //"Món hàng A + Món hàng B"; // nội dung hàng
        ServiceName: deliveryInfo.serviceCode, //"BK"; // tên dịch vụ
        SenderFullname: seller.shopName, // tên người gửi
        SenderAddress: store.address, // địa chỉ gửi
        SenderTel: seller.phone, // phone người gửi
        SenderProvinceId: storeAddress.provinceId, // mã tỉnh người gửi
        SenderDistrictId: storeAddress.districtId, // mã quận người gửi
        SenderWardId: storeAddress.wardId ,// mã phường người gửi
        ReceiverFullname: buyer.name, // tên người nhận
        ReceiverAddress: buyer.address, // địa chỉ nhận
        ReceiverTel:  buyer.phone, // phone người nhận
        ReceiverProvinceId: receiverAddress.provinceId, // mã tỉnh người nhận
        ReceiverDistrictId:  receiverAddress.districtId, // mã quận người nhận
        ReceiverWardId:  receiverAddress.wardId, // mã phường người nhận
        CodAmountEvaluation: order.subtotal.toString(), // giá trị tiền thu hộ
        OrderAmountEvaluation:  deliveryInfo.showOrderAmount  ? order.subtotal.toString() : null, // giá trị khai giá
        WeightEvaluation: order.deliveryInfo.productWeight.toString(), // cân nặng
        WidthEvaluation: order.deliveryInfo.productWidth.toString(), // chiều rộng
        LengthEvaluation: order.deliveryInfo.productLength.toString(), // chiều dài
        HeightEvaluation: order.deliveryInfo.productHeight.toString(), // chiều cao
        VASIds, //[3, 1, 2, 4]; // dịch vụ cộng thêm
        IsReceiverPayFreight: true, // thu cước người nhận
        CustomerNote: deliveryInfo.note, // yêu cầu khác
        SenderAddressType: 1,
        ReceiverAddressType: 1
      }

      const bill = await VietnamPostHelper.createDeliveryOrder(data);

      // order.deliveryInfo.orderNumber = bill.orderNumber;
      // order.deliveryInfo.partnerFee = bill.moneyTotal;
    }
    return await order.save();
  },
};

export default { Mutation };
