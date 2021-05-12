import { gql } from "apollo-server-express";
import { get, keyBy, set } from "lodash";
import { Types } from "mongoose";

import { SettingKey } from "../../../configs/settingData";
import { ROLES } from "../../../constants/role.const";
import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { Context } from "../../context";
import { CustomerLoader, ICustomer } from "../customer/customer.model";
import { IMember, MemberLoader } from "../member/member.model";
import { OrderItemLoader } from "../orderItem/orderItem.model";
import { ProductModel } from "../product/product.model";
import { SettingHelper } from "../setting/setting.helper";
import { IOrder, OrderModel, OrderStatus, OrderType } from "./order.model";
import { CreateOrderInput, OrderGenerator } from "./orderGenerator";

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
          console.log("generating order...");
          await orderGenerator.generate();
          console.log("order is ready...");
          set(context, "isDraft", true);
          const draft = orderGenerator.toDraft();
          console.log("draft", draft);
          return {
            order: draft,
            invalid: false,
            invalidReason: null,
          } as any;
        } catch (err) {
          console.log("error", err);
          return {
            order: null,
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
