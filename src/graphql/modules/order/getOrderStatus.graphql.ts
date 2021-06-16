import { gql } from "apollo-server-express";
import { Context } from "../../context";

export default {
  schema: gql`
    extend type Query {
      getOrderStatus: [OrderStatus]
    }
    type OrderStatus {
      "Mã trạng thái"
      code: String
      "Tên hiển thị"
      name: String
    }
  `,
  resolver: {
    Query: {
      getOrderStatus: async (root: any, args: any, context: Context) => {
        return [
          { code: "PENDING", name: "Chờ xử lý" },
          { code: "CONFIRMED", name: "Đang làm món" },
          { code: "DELIVERING", name: "Đang giao" },
          { code: "COMPLETED", name: "Giao thành công" },
          { code: "CANCELED", name: "Đã huỷ" },
          // { code: "RETURNED", name: "Đã hoàn hàng" },
          { code: "FAILURE", name: "Giao thất bại" },
        ];
      },
    },
  },
};
