import { gql } from "apollo-server-express";
import { get, set } from "lodash";
import { ROLES } from "../../../constants/role.const";
import LocalBroker from "../../../services/broker";
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
        let presenterId = context.isCustomer() ? context.id : customerId;
        if (presenterId == "") return [] as any[];
        context.meta.presenterId = presenterId;
        set(args, "q.filter.presenterId", presenterId);
        return customerService.fetch(args.q, "_id name phone avatar presenterId context");
      },
    },
    InvitedCustomer: {
      ordered: async (root: any, args: any, context: Context) => {
        return get(root, "context.order", 0) > 0;
      },
      commission: async (root: any, args: any, context: Context) => {
        return LocalBroker.call("commission.estimateFromCustomer", {
          id: context.meta.presenterId,
          from: root._id.toString(),
        });
      },
    },
  },
};
