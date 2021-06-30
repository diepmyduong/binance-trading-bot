import { gql } from "apollo-server-express";
import { merge } from "lodash";

import { ErrorHelper } from "../../../base/error";
import { ROLES } from "../../../constants/role.const";
import { onMemberDelivering } from "../../../events/onMemberDelivering.event";
import { GetVietnamPostDeliveryStatusText, VietnamPostHelper } from "../../../helpers";
import {
  ICalculateAllShipFeeRequest,
  ICreateDeliveryOrderRequest,
  PickupType,
} from "../../../helpers/vietnamPost/resources/type";
import { Context } from "../../context";
import { ShopConfigModel } from "../shopConfig/shopConfig.model";
import { IOrder, OrderModel, OrderStatus, PaymentMethod } from "./order.model";

export default {
  schema: gql`
    extend type Mutation {
      transferOrderToVNPost(orderId: ID!, data: TransferOrderToVNPostInput!): Order
      transferOrderToVNPostDraft(orderId: ID!, data: TransferOrderToVNPostInput!): Order
    }
    input TransferOrderToVNPostInput {
      "Tên người gửi *"
      senderFullname: String!
      "Số điện thoại người gửi"
      senderTel: String!
      "Địa chỉ gửi"
      senderAddress: String!
      "Mã phường người gửi"
      senderWardId: String!
      "Mã tỉnh người gửi"
      senderProvinceId: String!
      "Mã quận người gửi"
      senderDistrictId: String!

      "Tên người nhận"
      receiverFullname: String!
      "Địa chỉ nhận"
      receiverAddress: String!
      "Phone người nhận"
      receiverTel: String!
      "Mã tỉnh người nhận"
      receiverProvinceId: String!
      "Mã quận người nhận"
      receiverDistrictId: String!
      "Mã phường người nhận"
      receiverWardId: String!
      "Loại địa chỉ người nhận '1=Nhà riêng | 2=Cơ quan | null=Không có thông tin'"
      receiverAddressType: Int
      "Mã hóa đơn liên quan"
      orderCode: String
      "Nội dung hàng"
      packageContent: String
      "Trọng lượng (gr)"
      weightEvaluation: Int!
      "Chiều rộng (cm)"
      widthEvaluation: Int
      "Chiều dài (cm)"
      lengthEvaluation: Int
      "Chiều cao (cm)"
      heightEvaluation: Int
      "Số tiền thu hộ"
      codAmountEvaluation: Float
      "Cho xem hàng không ?"
      isPackageViewable: Boolean!
      "Giá trị đơn hàng tạm tính"
      orderAmountEvaluation: Float
      "Cộng thêm cước vào phí thu hộ"
      isReceiverPayFreight: Boolean
      "Yêu cầu khác"
      customerNote: String
      "Báo phát"
      useBaoPhat: Boolean
      "Hóa đơn"
      useHoaDon: Boolean
      "Dịch vụ"
      serviceName: String
    }
  `,
  resolver: {
    Mutation: {
      transferOrderToVNPost: async (root: any, args: any, context: Context) => {
        context.auth([ROLES.MEMBER]);
        const { orderId, data } = args;
        const shopConfig = await getShopConfig(context);
        const order = await getOrder(orderId, context);
        order.deliveryInfo = merge(order.deliveryInfo, data);
        await requestVNPostBill(order, shopConfig.vnpostToken);
        await order.save();
        onMemberDelivering.next(order);
        return order;
      },
      transferOrderToVNPostDraft: async (root: any, args: any, context: Context) => {
        context.auth([ROLES.MEMBER]);
        const { orderId, data } = args;
        const shopConfig = await getShopConfig(context);
        const order = await getOrder(orderId, context);
        order.deliveryInfo = merge(order.deliveryInfo, data);
        const vnpostShipFee = await calculateVNPostShipFee(order, shopConfig.vnpostToken);
        order.deliveryInfo = merge(order.deliveryInfo, {
          serviceName: vnpostShipFee.MaDichVu as any,
          codAmountEvaluation: order.paymentMethod == PaymentMethod.COD ? order.subtotal : 0,
          deliveryDateEvaluation: vnpostShipFee.ThoiGianPhatDuKien,
          partnerFee: vnpostShipFee.TongCuocBaoGomDVCT,
        });
        return order;
      },
    },
  },
};
async function getShopConfig(context: Context) {
  const shopConfig = await ShopConfigModel.findOne({ memberId: context.id });
  if (!shopConfig || !shopConfig.vnpostToken) throw Error("Chủ shop chưa kết nối giao hàng VNPost");
  return shopConfig;
}

async function getOrder(orderId: any, context: Context) {
  const order = await OrderModel.findById(orderId);
  if (!order || order.status != OrderStatus.CONFIRMED) {
    throw Error("Đơn hàng không thể giao");
  }
  if (context.isMember() && order.sellerId.toString() != context.id.toString())
    throw ErrorHelper.permissionDeny();
  return order;
}

async function requestVNPostBill(order: IOrder, token: string) {
  const billRequestData = getBillRequestData(order);
  const vnpostBill = await VietnamPostHelper.createDeliveryOrder(billRequestData, token);
  order.deliveryInfo.itemCode = vnpostBill.ItemCode;
  order.deliveryInfo.orderId = vnpostBill.Id;
  order.deliveryInfo.customerCode = vnpostBill.CustomerCode;
  order.deliveryInfo.vendorId = vnpostBill.VendorId;
  order.deliveryInfo.createTime = vnpostBill.CreateTime; // thời gian tạo đơn
  order.deliveryInfo.lastUpdateTime = vnpostBill.LastUpdateTime; // thời gian cập nhật lần cuối
  order.deliveryInfo.deliveryDateEvaluation = vnpostBill.DeliveryDateEvaluation; // ngày dự kiến giao hàng
  order.deliveryInfo.status = vnpostBill.OrderStatusId.toString();
  order.deliveryInfo.statusText = GetVietnamPostDeliveryStatusText(
    vnpostBill.OrderStatusId.toString()
  );
  order.deliveryInfo.partnerFee = vnpostBill.TotalFreightIncludeVatEvaluation;
  order.status = OrderStatus.DELIVERING;
}

function getBillRequestData(order: IOrder): ICreateDeliveryOrderRequest {
  return {
    SenderFullname: order.deliveryInfo.senderFullname,
    SenderTel: order.deliveryInfo.senderTel,
    SenderAddress: order.deliveryInfo.senderAddress,
    SenderWardId: order.deliveryInfo.senderWardId,
    SenderProvinceId: order.deliveryInfo.senderProvinceId,
    SenderDistrictId: order.deliveryInfo.senderDistrictId,

    // Kiểu địa chỉ người nhận: 1 Nhà riêng, 2: Cơ quan Nếu không có thông tin thì để null
    ReceiverFullname: order.deliveryInfo.receiverFullname,
    ReceiverAddress: order.deliveryInfo.receiverAddress,
    ReceiverTel: order.deliveryInfo.receiverTel,
    ReceiverProvinceId: order.deliveryInfo.receiverProvinceId,
    ReceiverDistrictId: order.deliveryInfo.receiverDistrictId,
    ReceiverWardId: order.deliveryInfo.receiverWardId,

    ReceiverAddressType: order.deliveryInfo.receiverAddressType,
    ServiceName: order.deliveryInfo.serviceName as any,

    OrderCode: order.code,
    PackageContent: order.deliveryInfo.packageContent,

    WeightEvaluation: order.deliveryInfo.weightEvaluation,
    WidthEvaluation: order.deliveryInfo.widthEvaluation,
    LengthEvaluation: order.deliveryInfo.lengthEvaluation,
    HeightEvaluation: order.deliveryInfo.heightEvaluation,

    CodAmountEvaluation: order.deliveryInfo.codAmountEvaluation,

    IsPackageViewable: order.deliveryInfo.isPackageViewable,

    OrderAmountEvaluation: order.deliveryInfo.orderAmountEvaluation,

    IsReceiverPayFreight: order.deliveryInfo.isReceiverPayFreight,
    CustomerNote: order.deliveryInfo.customerNote,

    UseBaoPhat: order.deliveryInfo.useBaoPhat,
    UseHoaDon: order.deliveryInfo.useHoaDon,
    PickupType: PickupType.PICK_UP, // Thu gôm tận nơi
  };
}

async function calculateVNPostShipFee(order: IOrder, token: string) {
  const data: ICalculateAllShipFeeRequest = {
    MaDichVu: order.deliveryInfo.serviceName,
    MaTinhGui: order.deliveryInfo.senderProvinceId,
    MaQuanGui: order.deliveryInfo.senderDistrictId,
    MaTinhNhan: order.deliveryInfo.receiverProvinceId,
    MaQuanNhan: order.deliveryInfo.receiverDistrictId,
    Dai: order.deliveryInfo.lengthEvaluation,
    Rong: order.deliveryInfo.widthEvaluation,
    Cao: order.deliveryInfo.heightEvaluation,
    KhoiLuong: order.deliveryInfo.weightEvaluation,
    ThuCuocNguoiNhan: order.paymentMethod == PaymentMethod.COD,
    LstDichVuCongThem:
      order.paymentMethod == PaymentMethod.COD
        ? [
            {
              DichVuCongThemId: 3,
              TrongLuongQuyDoi: 0,
              SoTienTinhCuoc: order.subtotal.toString(),
            },
          ]
        : [],
  };

  return await VietnamPostHelper.calculateAllShipFee(data, token);
}
