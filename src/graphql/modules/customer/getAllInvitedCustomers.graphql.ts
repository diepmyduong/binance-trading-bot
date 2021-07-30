import { gql } from "apollo-server-express";
import { set } from "lodash";
import { ROLES } from "../../../constants/role.const";
import { Context } from "../../context";
import { customerService } from "./customer.service";

export default {
  schema: gql`
    extend type Query {
      getAllInvitedCustomers(customerId: ID!, q: QueryGetListInput): InvitedCustomerPageData
    }
    type InvitedCustomerPageData {
      data: [InvitedCustomer]
      total: Int
      pagination: Pagination
    }
    type InvitedCustomer {
      "Mã KH"
      id: ID
      "Tên KH"
      name: String
      "Ảnh đại diện"
      avatar: String
      "Điện thoại"
      phone: String
      "Đã mua hàng"
      ordered: Boolean
      "Hoa hồng"
      commission: Float
    }
  `,
  resolver: {
    Query: {
      getAllInvitedCustomers: async (root: any, args: any, context: Context) => {
        context.auth(ROLES.MEMBER_STAFF_CUSTOMER);
        const { customerId } = args;
        set(args, "q.filter.presenterId", customerId);
        if (context.isCustomer()) {
          set(args, "q.filter.presenterId", context.id);
        }
        return customerService.fetch(args.q, "_id name phone avatar presenterId");
      },
    },
  },
};
