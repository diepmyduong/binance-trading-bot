import { gql } from "apollo-server-express";
export default gql`
  type ShipServicePricing {
    "Mã dịch vụ"
    code: String
    "Tên dịch vụ"
    name: String
    "Giá cước"
    price: Float
    "Thời gian dự kiến"
    time: String
    exchangeWeight: Float
  }
`;

// IDDanhMucDichVu: 35,
// TenDanhMucDichVu: 'Lô TMĐT-Chuyển phát tiêu chuẩn',
// MaDichVu: 'LO_TMDT_BK',
// ServiceType: 2,
// IsLo: true,
// IsDonLe: false,
// CanPhanQuyen: false,
// Checked: false,
// IsGanKhachHang: false