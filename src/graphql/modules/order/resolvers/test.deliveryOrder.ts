import { ROLES } from "../../../../constants/role.const";
import { Context } from "../../../context";
import { OrderModel, OrderStatus, ShipMethod } from "../order.model";
import { ErrorHelper } from "../../../../helpers/error.helper";
import {
  VietnamPostHelper,
  AddressType,
} from "../../../../helpers/vietnamPost/vietnamPost.helper";
import { AddressModel } from "../../address/address.model";
import { AddressStorehouseModel } from "../../addressStorehouse/addressStorehouse.model";
import { MemberModel } from "../../member/member.model";
import { CustomerModel } from "../../customer/customer.model";
import { AddressDeliveryModel } from "../../addressDelivery/addressDelivery.model";

const Mutation = {
  deliveryOrder: async (root: any, args: any, context: Context) => {
//     context.auth(ROLES.ADMIN_EDITOR_MEMBER);
//     const { orderId, deliveryInfo } = args;

//     const order = await OrderModel.findById(orderId);
//     if (!order) throw ErrorHelper.mgRecoredNotFound("Đơn hàng");

//     const seller = await MemberModel.findById(context.id);
//     if (!seller) throw ErrorHelper.mgRecoredNotFound("chủ shop");

//     const buyer = await CustomerModel.findById(order.buyerId);
//     if (!buyer) throw ErrorHelper.mgRecoredNotFound("khách hàng");
//     // post vận đơn
//     //vnpost vận đơn

//     // Kiểm tra tình trạng đơn hàng
//     if (order.status != OrderStatus.PENDING)
//       throw ErrorHelper.cannotEditOrder();

//     if (order.shipMethod === ShipMethod.NONE)
//       throw ErrorHelper.cannotMatchShipMethod();
//     // Chuyển trạng thái đơn hàng
//     order.status = OrderStatus.DELIVERING;

  

//     const store = await AddressStorehouseModel.findById(
//       deliveryInfo.addressStorehouseId
//     );
//     if (!store) throw ErrorHelper.notConnectedInventory();
//     const storeAddress = await AddressModel.findOne({ wardId: store.wardId });


//     let receiverAddress = null;

//     //nếu post vận đơn
//     //lấy ra địa chỉ kho chính + addressDeliveryId -> deliveryInfo chạy đơn
//     if (order.shipMethod === ShipMethod.POST){
//       const addressDelivery = await AddressDeliveryModel.findById(order.addressDeliveryId);
//       receiverAddress = await AddressModel.findOne({
//         wardId: addressDelivery.wardId,
//       });
//     }

//     // nếu vnpost vận đơn
//     // lấy địa chỉ kho trong delivery info -> deliveryInfo chạy đơn
//     if (order.shipMethod === ShipMethod.VNPOST){
//       receiverAddress = await AddressModel.findOne({
//         wardId: order.buyerWardId,
//       });
//     }
    
//     if(!receiverAddress) 
//       throw ErrorHelper.recoredNotFound("địa điểm nhận hàng");

//     const data: any = {

//       SenderFullname: seller.shopName, // tên người gửi *
//       SenderTel: seller.phone, // Số điện thoại người gửi * (maxlength: 50)
//       SenderAddress: store.address, // địa chỉ gửi *
//       SenderWardId: storeAddress.wardId, // mã phường người gửi *
//       SenderProvinceId: storeAddress.provinceId, // mã tỉnh người gửi *
//       SenderDistrictId: storeAddress.districtId, // mã quận người gửi *

//       // Kiểu địa chỉ người nhận: 1 Nhà riêng, 2: Cơ quan Nếu không có thông tin thì để null

//       ReceiverFullname: buyer.name, // tên người nhận *
//       ReceiverAddress: buyer.address, // địa chỉ nhận *
//       ReceiverTel: buyer.phone, // phone người nhận *
//       ReceiverProvinceId: receiverAddress.provinceId, // mã tỉnh người nhận *
//       ReceiverDistrictId: receiverAddress.districtId, // mã quận người nhận *
//       ReceiverWardId: receiverAddress.wardId, // mã phường người nhận *
      
//       ReceiverAddressType: AddressType.NHA_RIENG, // null
//       ServiceName: deliveryInfo.serviceId, //"BK"; // tên dịch vụ *

//       OrderCode: order.code, // mã đơn hàng
//       PackageContent: deliveryInfo.productName, //"Món hàng A + Món hàng B"; // nội dung hàng

//       WeightEvaluation: deliveryInfo.productWeight.toString(), // cân nặng *
//       WidthEvaluation: deliveryInfo.productWidth.toString(), // chiều rộng
//       LengthEvaluation: deliveryInfo.productLength.toString(), // chiều dài
//       HeightEvaluation: deliveryInfo.productHeight.toString(), // chiều cao

//       CodAmountEvaluation: order.subtotal.toString(), // giá trị tiền thu hộ
      
//       IsPackageViewable: deliveryInfo.isPackageViewable, // cho xem hàng


//       OrderAmountEvaluation: deliveryInfo.showOrderAmount // khai giá lấy giá trị subtotal
//         ? order.subtotal.toString()
//         : null, // giá trị khai giá
     
//       IsReceiverPayFreight: deliveryInfo.hasReceiverPayFreight, // thu cước người nhận
//       CustomerNote: deliveryInfo.note, // yêu cầu khác   
      
//       UseBaoPhat : true,
//       UseHoaDon: true,

//       VendorId: 1, // 1;
//       PickupType: 1, //1;
// //       - 1: Pickup - Thu gom tận nơi 
// // - 2: Dropoff - Gửi hàng tại bưu cục

//     };

//     const bill = await VietnamPostHelper.createDeliveryOrder(data);
    
//     order.deliveryInfo = {
//       ...deliveryInfo
//     };

//     // orderCode: { type: String }, // itemCode
//     // orderNumber: { type: String }, // id

//     order.deliveryInfo.orderCode = bill.orderCode;
//     order.deliveryInfo.orderNumber = bill.orderNumber;
//     order.deliveryInfo.partnerFee = bill.moneyTotalFee;
//     return await order.save();
  },
};

export default { Mutation };