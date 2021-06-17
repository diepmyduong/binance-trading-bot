import { gql } from "apollo-server-express";
import { get, set } from "lodash";

import { ROLES } from "../../../constants/role.const";
import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { Context } from "../../context";
import { CustomerLoader } from "../customer/customer.model";
import { MemberLoader } from "../member/member.model";
import { OrderItemLoader } from "../orderItem/orderItem.model";
import { IOrder } from "./order.model";
import { OrderGenerator } from "./orderGenerator";

export default {
  schema: gql`
    extend type Mutation {
      generateDraftOrder(data: CreateDraftOrderInput!): DraftOrderData
    }
    type DraftOrderData {
      order: Order
      invalid: Boolean
      invalidReason: String
    }
    input CreateDraftOrderInput {
      isPrimary: Boolean!
      items: [OrderItemInput]!
      buyerName: String
      buyerPhone: String
      buyerAddress: String
      buyerProvinceId: String
      buyerDistrictId: String
      buyerWardId: String
      shipMethod: String!
      paymentMethod: String!
      addressDeliveryId: ID
      note: String
      latitude: Float
      longitude: Float
    }
    input OrderItemInput {
      productId: ID!
      quantity: Int!
      toppings: [OrderItemToppingInput]
    }
  `,
  resolver: {
    Mutation: {
      generateDraftOrder: async (root: any, args: any, context: Context) => {
        context.auth([ROLES.CUSTOMER]);
        const orderInput = args.data;
        const { sellerId, id: buyerId, campaignCode, collaboratorId } = context;
        const [seller, customer] = await Promise.all([
          MemberLoader.load(sellerId),
          CustomerLoader.load(buyerId),
        ]);
        const orderGenerator = new OrderGenerator(
          orderInput,
          seller,
          customer,
          collaboratorId,
          campaignCode
        );
        try {
          await orderGenerator.generate();
          set(context, "isDraft", true);
          const draft = orderGenerator.toDraft();
          return {
            order: draft,
            invalid: false,
            invalidReason: null,
          } as any;
        } catch (err) {
          console.log("error", err);
          return {
            order: orderGenerator.toDraft(),
            invalid: true,
            invalidReason: err.message,
          } as any;
        }
      },
    },
    Order: {
      items: async (root: IOrder, args: any, context: Context) => {
        if (get(context, "isDraft")) {
          return root.items;
        } else {
          return GraphQLHelper.loadManyById(OrderItemLoader, "itemIds")(root, args, context);
        }
      },
    },
  },
};
