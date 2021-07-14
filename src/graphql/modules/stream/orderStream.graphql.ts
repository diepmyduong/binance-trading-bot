import { gql, withFilter } from "apollo-server-express";
import { ROLES } from "../../../constants/role.const";
import { PubSubHelper } from "../../../helpers/pubsub.helper";
import { Context } from "../../context";
import { IOrder } from "../order/order.model";
import { StaffLoader } from "../staff/staff.model";

export default {
  schema: gql`
    extend type Subscription {
      orderStream: Order
    }
  `,
  resolver: {
    Subscription: {
      orderStream: {
        resolve: (payload: any) => payload,
        subscribe: withFilter(
          (root: any, args: any, context: Context) => {
            context.auth(ROLES.MEMBER_STAFF_CUSTOMER);
            return PubSubHelper.pubsub.asyncIterator(["order"]);
          },
          async (payload: IOrder, args: any, context: Context) => {
            if (payload.sellerId.toString() != context.sellerId.toString()) {
              return false;
            }
            if (context.isCustomer()) {
              return payload.buyerId.toString() == context.id;
            }
            return true;
          }
        ),
      },
    },
  },
};
