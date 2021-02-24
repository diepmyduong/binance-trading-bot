import { gql } from "apollo-server-express";
import { DeliveryServices, PickupTypes, VietnamPostHelper } from "../../../../helpers";

export default gql`
  type DeliveryInfo {
    "Tên người gửi *"
    senderFullname: String
    "Số điện thoại người gửi"
    senderTel: String
    "Địa chỉ gửi"
    senderAddress: String
    "Mã phường người gửi"
    senderWardId: String
    "Mã tỉnh người gửi"
    senderProvinceId: String
    "Mã quận người gửi"
    senderDistrictId: String

    "Tên người nhận"
    receiverFullname: String
    "Địa chỉ nhận"
    receiverAddress: String
    "Phone người nhận"
    receiverTel: String
    "Mã tỉnh người nhận"
    receiverProvinceId: String
    "Mã quận người nhận"
    receiverDistrictId: String
    "Mã phường người nhận"
    receiverWardId: String!
    "Loại địa chỉ người nhận '1=Nhà riêng | 2=Cơ quan | null=Không có thông tin'"
    receiverAddressType: Int

    "Mã Dịch vụ chuyển phát '${DeliveryServices.map(s=>`${s.code}-${s.name}`).join(' | ')}'"
    serviceName: String!

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
    isPackageViewable: Boolean

    "Hình thức thu gom '${PickupTypes.map(s=>`${s.code}-${s.name}`).join(' | ')}'"
    pickupType: Int

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

    "Mã khách hàng"
    customerCode: String
    
    "Mã nhà cung cấp"
    vendorId: String

    "Code đơn vận"
    itemCode: String
    
    "Mã đơn vận"
    orderId: String

    "Thời gian tạo đơn"
    createTime: String
    "Cập nhật lần cuối"
    lastUpdateTime: String
    "Ngày dự kiến giao hàng"
    deliveryDateEvaluation: String
    "Thời gian hủy đơn"
    cancelTime: String
    "Thời gian giao hàng"
    deliveryTime: String
    "Số lần báo phát"
    deliveryTimes: Int
    "Mã tình trạng"
    status: String
    "Tình trạng"
    statusText: String
  }

  input DeliveryInfoInput {
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

    "Mã Dịch vụ chuyển phát '${DeliveryServices.map(s=>`${s.code}-${s.name}`).join(' | ')}'"
    serviceName: String!

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

    "Hình thức thu gom '${PickupTypes.map(s=>`${s.code}-${s.name}`).join(' | ')}'"
    pickupType: Int!

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
  }
`;
