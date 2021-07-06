import { Schema } from "mongoose";
import {
  AddressType,
  ServiceCode,
  PickupType,
} from "../../../../helpers/vietnamPost/resources/type";

export type DeliveryInfo = {
  senderFullname?: string; // tên người gửi *
  senderTel?: string; // Số điện thoại người gửi * (maxlength: 50)
  senderAddress?: string; // địa chỉ gửi *
  senderWardId?: string; // mã phường người gửi *
  senderProvinceId?: string; // mã tỉnh người gửi *
  senderDistrictId?: string; // mã quận người gửi *

  receiverFullname?: string; // tên người nhận *
  receiverAddress?: string; // địa chỉ nhận *
  receiverTel?: string; // phone người nhận *
  receiverProvinceId?: string; // mã tỉnh người nhận *
  receiverDistrictId?: string; // mã quận người nhận *
  receiverWardId?: string; // mã phường người nhận *

  receiverAddressType?: AddressType; // Kiểu địa chỉ người nhận: 1 Nhà riêng, 2: Cơ quan Nếu không có thông tin thì để null

  serviceName?: string;
  serviceIcon?: string; // Icon Dịch vụ

  orderCode?: string; // mã đơn hàng
  packageContent?: string; //"Món hàng A + Món hàng B"; // nội dung hàng

  weightEvaluation?: number; // cân nặng *
  widthEvaluation?: number; // chiều rộng
  lengthEvaluation?: number; // chiều dài
  heightEvaluation?: number; // chiều cao

  codAmountEvaluation?: number; // tiền thu hộ tạm tính

  isPackageViewable?: boolean; // cho xem hàng

  pickupType?: PickupType; //1;

  orderAmountEvaluation?: number; // giá trị đơn hàng tạm tính

  isReceiverPayFreight?: boolean; // Cộng thêm cước vào tiền thu hộ
  customerNote?: string; // yêu cầu khác
  useBaoPhat?: boolean;
  useHoaDon?: boolean;

  // bỏ qua
  customerCode?: string; // mã khách hàng
  vendorId?: string; // 1; // mã nhà cung cấp

  itemCode?: string;
  orderId?: string;
  // kết quả delivery
  createTime?: string; // thời gian tạo đơn
  lastUpdateTime?: string; // thời gian cập nhật lần cuối
  deliveryDateEvaluation?: string; // ngày dự kiến giao hàng
  cancelTime?: string; // thời gian hủy
  deliveryTime?: string; // thời gian vận chuyển
  deliveryTimes?: number; // Số lần báo phát
  status?: string;
  statusText?: string;

  partnerFee?: number; // Phí giao hàng trả cho đối tác
  sharedLink?: string; // Link chia sẻ
};

export const DeliveryInfoSchema = new Schema({
  senderFullname: { type: Schema.Types.String }, // tên người gửi *
  senderTel: { type: Schema.Types.String }, // Số điện thoại người gửi * (maxlength: 50)
  senderAddress: { type: Schema.Types.String }, // địa chỉ gửi *
  senderWardId: { type: Schema.Types.String }, // mã phường người gửi *
  senderProvinceId: { type: Schema.Types.String }, // mã tỉnh người gửi *
  senderDistrictId: { type: Schema.Types.String }, // mã quận người gửi *

  receiverFullname: { type: Schema.Types.String }, // tên người nhận *
  receiverAddress: { type: Schema.Types.String }, // địa chỉ nhận *
  receiverTel: { type: Schema.Types.String }, // phone người nhận *
  receiverProvinceId: { type: Schema.Types.String }, // mã tỉnh người nhận *
  receiverDistrictId: { type: Schema.Types.String }, // mã quận người nhận *
  receiverWardId: { type: Schema.Types.String }, // mã phường người nhận *

  receiverAddressType: {
    type: Schema.Types.String,
    enum: Object.values(AddressType),
  }, // Kiểu địa chỉ người nhận: 1 Nhà riêng, 2: Cơ quan Nếu không có thông tin thì để null

  serviceName: { type: Schema.Types.String },
  serviceIcon: { type: String },

  orderCode: { type: Schema.Types.String }, // mã đơn hàng
  packageContent: { type: Schema.Types.String }, //"Món hàng A + Món hàng B"; // nội dung hàng

  weightEvaluation: { type: Schema.Types.Number, min: 1 }, // cân nặng *
  widthEvaluation: { type: Schema.Types.Number, min: 0 }, // chiều rộng
  lengthEvaluation: { type: Schema.Types.Number, min: 0 }, // chiều dài
  heightEvaluation: { type: Schema.Types.Number, min: 0 }, // chiều cao

  codAmountEvaluation: { type: Schema.Types.Number, min: 0 }, // tiền thu hộ tạm tính

  isPackageViewable: { type: Schema.Types.Boolean }, // cho xem hàng

  pickupType: {
    type: Schema.Types.Number,
    enum: Object.values(PickupType),
    default: PickupType.DROP_OFF,
    // required: true,
  }, //1;

  orderAmountEvaluation: { type: Schema.Types.Number }, // giá trị đơn hàng tạm tính
  isReceiverPayFreight: { type: Schema.Types.Boolean }, // Cộng thêm cước vào tiền thu hộ
  customerNote: { type: Schema.Types.String }, // yêu cầu khác
  useBaoPhat: { type: Schema.Types.Boolean },
  useHoaDon: { type: Schema.Types.Boolean },

  // bỏ qua
  customerCode: { type: Schema.Types.String }, // mã khách hàng
  vendorId: { type: Schema.Types.String }, // 1; // mã nhà cung cấp

  // kết quả delivery
  itemCode: { type: Schema.Types.String },
  orderId: { type: Schema.Types.String },

  createTime: { type: Schema.Types.String }, // thời gian tạo đơn
  lastUpdateTime: { type: Schema.Types.String }, // thời gian cập nhật lần cuối
  deliveryDateEvaluation: { type: Schema.Types.String }, // ngày dự kiến giao hàng
  cancelTime: { type: Schema.Types.String }, // thời gian hủy
  deliveryTime: { type: Schema.Types.String }, // thời gian vận chuyển
  deliveryTimes: { type: Schema.Types.Number }, // Số lần báo phát
  status: { type: Schema.Types.String }, // Mã tình trạng
  statusText: { type: Schema.Types.String },

  partnerFee: { type: Schema.Types.Number }, // phí phải trả cho vnpost
  sharedLink: { type: String },
});
