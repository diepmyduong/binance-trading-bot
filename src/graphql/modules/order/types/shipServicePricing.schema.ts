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
