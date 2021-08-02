import { gql } from "apollo-server-express";
import { ROLES } from "../../../constants/role.const";
import LocalBroker from "../../../services/broker";
import { Context } from "../../context";
import { ICustomer } from "../customer/customer.model";

export default {
  schema: gql`
    extend type Customer {
      commissionSummary: CustomerCommissionSummary
    }
    type CustomerCommissionSummary {
      commission: Float
      order: Int
    }
  `,
  resolver: {
    Customer: {
      commissionSummary: async (root: ICustomer, args: any, context: Context) => {
        context.auth(ROLES.MEMBER_STAFF_CUSTOMER);
        if (context.isCustomer() && root._id.toString() != context.id) return null;
        return await LocalBroker.call("commission.estimateCustomer", { id: root._id.toString() });
      },
    },
  },
};
