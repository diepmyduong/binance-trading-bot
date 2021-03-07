import { ROLES } from "../../../../constants/role.const";
import { GraphQLHelper } from "../../../../helpers/graphql.helper";
import { Context } from "../../../context";
import { OrderItemLoader } from "../../orderItem/orderItem.model";
import { OrderHelper } from "../order.helper";
import { IOrder } from "../order.model";

class OrderContext extends Context {
  isDraft: boolean; // Đơn hàng nháp
}

type DraftOrderData = {
  orders: any; // Đơn hàng
  invalid: boolean; // không hợp lệ
  invalidReason: string; // lý do không hợp lệ
};

const Mutation = {
  generateDraftDeliveryOrder: async (root: any, args: any, context: OrderContext) => {
    context.auth(ROLES.ADMIN_EDITOR_MEMBER);
    const { id: sellerId } = context;

  },
};
const Order = {
  items: async (root: IOrder, args: any, context: OrderContext) => {
    if (context.isDraft) {
      // return root.items;
    } else {
      return GraphQLHelper.loadManyById(OrderItemLoader, "itemIds")(
        root,
        args,
        context
      );
    }
  },
};
export default { Mutation, Order };
