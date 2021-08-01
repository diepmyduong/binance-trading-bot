import { gql } from "apollo-server-express";
import LocalBroker from "../../../services/broker";
import { Context } from "../../context";
import { ICustomer } from "../customer/customer.model";
import { getContextValue } from "./mixin";

export default {
  schema: gql`
    extend type Customer {
      "Số đơn hàng"
      order: Int
    }
  `,
  resolver: {
    Customer: {
      order: (root: ICustomer, args: any, context: Context) => {
        return LocalBroker.call("customerContext.estimateOrder", {
          customerId: root._id.toString(),
        }).then((res: any) => res.total);
      },
    },
  },
};
