import { gql } from "apollo-server-express";
import { ROLES } from "../../../constants/role.const";
import { Context } from "../../context";

export default {
  schema: gql`
    extend type Query {
      getCustomerGroupResource: [CustomerGroupResource]
    }
    type CustomerGroupResource {
      "Mã resource"
      id: String
      "Tên resource"
      name: String
      "Loại resource"
      type: String
      "Dữ liệu kèm theo"
      meta: Mixed
    }
  `,
  resolver: {
    Query: {
      getCustomerGroupResource: async (root: any, args: any, context: Context) => {
        context.auth([ROLES.MEMBER]);
        return [
          { type: "number", id: "order", name: "Tổng số đơn", meta: {} },
          { type: "number", id: "completed", name: "Đơn Hoàn thành", meta: {} },
          { type: "number", id: "canceled", name: "Đơn Huỷ", meta: {} },
          { type: "number", id: "voucher", name: "Voucher sử dụng", meta: {} },
          { type: "number", id: "discount", name: "Giảm giá", meta: {} },
        ];
      },
    },
  },
};
