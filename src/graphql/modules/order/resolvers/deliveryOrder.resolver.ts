import { ROLES } from "../../../../constants/role.const";
import { Context } from "../../../context";
import { OrderModel, OrderStatus, ShipMethod } from "../order.model";
import { ErrorHelper } from "../../../../helpers/error.helper";
import {
  VietnamPostHelper,
  ICreateDeliveryOrderRequest,
} from "../../../../helpers/vietnamPost/vietnamPost.helper";
import { MemberModel } from "../../member/member.model";
import { CustomerModel } from "../../customer/customer.model";
import { DeliveryInfo } from "../types/deliveryInfo.type";

const Mutation = {
  deliveryOrder: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ADMIN_EDITOR_MEMBER);
    const { orderId } = args;

    const deliveryInfo: DeliveryInfo = args.deliveryInfo;

    const order = await OrderModel.findById(orderId);
    if (!order) throw ErrorHelper.mgRecoredNotFound("Đơn hàng");

    const seller = await MemberModel.findById(context.id);
    if (!seller) throw ErrorHelper.mgRecoredNotFound("chủ shop");

    const buyer = await CustomerModel.findById(order.buyerId);
    if (!buyer) throw ErrorHelper.mgRecoredNotFound("khách hàng");

    // Kiểm tra tình trạng đơn hàng
    if (order.status != OrderStatus.PENDING)
      throw ErrorHelper.cannotEditOrder();

    if (order.shipMethod === ShipMethod.NONE)
      throw ErrorHelper.cannotMatchShipMethod();
    // Chuyển trạng thái đơn hàng
    order.status = OrderStatus.DELIVERING;

    // bat address tai day

    const data: ICreateDeliveryOrderRequest = {
      SenderFullname: deliveryInfo.senderFullname, // tên người gửi *
      SenderTel: deliveryInfo.senderTel, // Số điện thoại người gửi * (maxlength: 50)
      SenderAddress: deliveryInfo.senderAddress, // địa chỉ gửi *
      SenderWardId: deliveryInfo.senderWardId, // mã phường người gửi *
      SenderProvinceId: deliveryInfo.senderProvinceId, // mã tỉnh người gửi *
      SenderDistrictId: deliveryInfo.senderDistrictId, // mã quận người gửi *

      // Kiểu địa chỉ người nhận: 1 Nhà riêng, 2: Cơ quan Nếu không có thông tin thì để null
      ReceiverFullname: deliveryInfo.receiverFullname, // tên người nhận *
      ReceiverAddress: deliveryInfo.receiverAddress, // địa chỉ nhận *
      ReceiverTel: deliveryInfo.receiverTel, // phone người nhận *
      ReceiverProvinceId: deliveryInfo.receiverProvinceId, // mã tỉnh người nhận *
      ReceiverDistrictId: deliveryInfo.receiverDistrictId, // mã quận người nhận *
      ReceiverWardId: deliveryInfo.receiverWardId, // mã phường người nhận *

      ReceiverAddressType: deliveryInfo.receiverAddressType, // null
      ServiceName: deliveryInfo.serviceName, //"BK"; // tên dịch vụ *

      OrderCode: order.code, // mã đơn hàng
      PackageContent: deliveryInfo.packageContent, //"Món hàng A + Món hàng B"; // nội dung hàng

      WeightEvaluation: deliveryInfo.weightEvaluation, // cân nặng *
      WidthEvaluation: deliveryInfo.widthEvaluation, // chiều rộng
      LengthEvaluation: deliveryInfo.lengthEvaluation, // chiều dài
      HeightEvaluation: deliveryInfo.heightEvaluation, // chiều cao

      CodAmountEvaluation: deliveryInfo.codAmountEvaluation, // giá trị tiền thu hộ

      IsPackageViewable: deliveryInfo.isPackageViewable, // cho xem hàng

      OrderAmountEvaluation: deliveryInfo.orderAmountEvaluation, // khai giá lấy giá trị subtotal

      IsReceiverPayFreight: deliveryInfo.isReceiverPayFreight, // thu cước người nhận
      CustomerNote: deliveryInfo.customerNote, // yêu cầu khác

      UseBaoPhat: deliveryInfo.useBaoPhat,
      UseHoaDon: deliveryInfo.useHoaDon,
      PickupType: deliveryInfo.pickupType, //1;
    };
    const bill = await VietnamPostHelper.createDeliveryOrder(data);

    order.deliveryInfo = {
      ...deliveryInfo,
    };
    
    order.deliveryInfo.itemCode = bill.ItemCode;
    order.deliveryInfo.orderId = bill.Id;

    order.deliveryInfo.customerCode = bill.CustomerCode;
    order.deliveryInfo.vendorId = bill.VendorId;

    order.deliveryInfo.itemCode = bill.ItemCode;
    order.deliveryInfo.orderId = bill.Id;

    // kết quả delivery
    order.deliveryInfo.createTime = bill.CreateTime; // thời gian tạo đơn
    order.deliveryInfo.lastUpdateTime = bill.LastUpdateTime; // thời gian cập nhật lần cuối
    order.deliveryInfo.deliveryDateEvaluation = bill.DeliveryDateEvaluation; // ngày dự kiến giao hàng
    return await order.save();
  },
};

export default { Mutation };
