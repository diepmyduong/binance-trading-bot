import { ROLES } from "../../../../constants/role.const";
import { Context } from "../../../context";
import { OrderModel } from "../order.model";
import { ErrorHelper } from "../../../../helpers/error.helper";
// import { OrderStatus } from "../../../../constants/model.const";
import { ViettelPostHelper } from "../../../../helpers/viettelPost/viettelPost.helper";
import { BranchModel } from "../../branch/branch.model";
import { AddressModel } from "../../address/address.model";
import { privateDecrypt } from "crypto";
import { OrderItemModel } from "../../orderItem/orderItem.model";

const Mutation = {
  deliveryOrder: async (root: any, args: any, context: Context) => {
    // context.auth(ROLES.ADMIN_EDITOR);
    // const { orderId, deliveryInfo } = args;
    // const order = await OrderModel.findById(orderId);
    // if (!order) throw ErrorHelper.mgRecoredNotFound("Đơn hàng");
    // // Kiểm tra tình trạng đơn hàng
    // if (order.status != OrderStatus.PENDING) throw ErrorHelper.cannotEditOrder();
    // // Chuyển trạng thái đơn hàng
    // order.status = OrderStatus.DELIVERING;
    // order.deliveryInfo = { ...order.deliveryInfo, ...deliveryInfo };
    // if (order.shipMethod == ShipMethod.VIETTEL_POST) {
    //   const store = await BranchModel.findById(order.deliveryInfo.storeId);
    //   if (!store.viettelInventoryId) throw ErrorHelper.branchNotConnectedInventory();
    //   const storeAddress = await AddressModel.findOne({ wardId: store.wardId });
    //   const receiverAddress = await AddressModel.findOne({ wardId: order.wardId });
    //   const items = await OrderItemModel.find({ orderId: order._id });
    //   const bill = await ViettelPostHelper.createOrder({
    //     orderNumber: order.id,
    //     groupAddress: store.viettelInventoryId,
    //     customerId: store.viettelCusId,
    //     deliveryDate: order.deliveryInfo.date,
    //     senderName: store.name,
    //     senderAddress: store.address,
    //     senderPhone: store.phone,
    //     senderEmail: store.email,
    //     senderWard: storeAddress.viettelWardId,
    //     senderDistrict: storeAddress.viettelDistrictId,
    //     senderProvince: storeAddress.viettelProvinceId,
    //     receiverName: order.customerName,
    //     receiverAddress: order.address,
    //     receiverPhone: order.customerPhone,
    //     // receiverEmail: order.customerE,
    //     receiverWard: receiverAddress.viettelWardId,
    //     receiverDistrict: receiverAddress.viettelDistrictId,
    //     receiverProvince: receiverAddress.viettelProvinceId,
    //     productName: order.deliveryInfo.productName,
    //     productDesc: order.deliveryInfo.productDesc,
    //     productQty: 1,
    //     productPrice: order.subtotal,
    //     productWeight: order.deliveryInfo.productWeight,
    //     productLength: order.deliveryInfo.productLength,
    //     productWidth: order.deliveryInfo.productWidth,
    //     productHeight: order.deliveryInfo.productHeight,
    //     productType: "HH",
    //     orderPayment: order.deliveryInfo.orderPayment,
    //     orderService: order.deliveryInfo.serviceId,
    //     orderServiceAdd: "",
    //     orderVoucher: order.deliveryInfo.orderVoucher,
    //     orderNote: order.deliveryInfo.note,
    //     moneyCollection: order.deliveryInfo.moneyCollection,
    //     listItems: items.map((i) => ({
    //       productName: i.productName,
    //       productPrice: i.salePrice,
    //       productQty: i.quantity,
    //       productWeight: i.productWeight,
    //     })),
    //   });
    //   order.deliveryInfo.orderNumber = bill.orderNumber;
    //   order.deliveryInfo.partnerFee = bill.moneyTotal;
    // }
    // return await order.save();
  },
};

export default { Mutation };
