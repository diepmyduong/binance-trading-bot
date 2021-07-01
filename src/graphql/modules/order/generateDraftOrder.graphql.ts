import { gql } from "apollo-server-express";
import { get, set } from "lodash";

import { ROLES } from "../../../constants/role.const";
import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { Context } from "../../context";
import { CustomerLoader } from "../customer/customer.model";
import { MemberLoader } from "../member/member.model";
import { OrderItemLoader } from "../orderItem/orderItem.model";
import { IOrder, PickupMethod } from "./order.model";
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
      "Sản phẩm"
      items: [OrderItemInput]!
      "Tên người đặt"
      buyerName: String!
      "Điện thoại người đặt"
      buyerPhone: String!
      "Phương thức nhận hàng ${Object.values(PickupMethod)}"
      pickupMethod: String!
      "Chi nhánh"
      shopBranchId: ID!
      "Thời gian nhận hàng"
      pickupTime: DateTime
      "Địa chỉ nhận"
      buyerAddress: String
      "Tỉnh / thành nhận"
      buyerProvinceId: String
      "Quận / huyện nhận"
      buyerDistrictId: String
      "Phường / xã nhận"
      buyerWardId: String
      "Toạ độ"
      latitude: Float!
      longitude: Float!
      "Phương thức thanh toán"
      paymentMethod: String!
      "Ghi chú"
      note: String
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
