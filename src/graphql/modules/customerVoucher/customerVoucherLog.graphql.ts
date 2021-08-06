import { gql } from "apollo-server-express";
import { Schema } from "mongoose";

import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { OrderLoader } from "../order/order.model";

export type CustomerVoucherLog = {
  _id?: string; // Mã log
  createdAt?: Date; // Ngày log
  orderId?: string; // Mã đơn hàng
  discount?: number; // Giảm giá
};

export const CustomerVoucherLogSchema = new Schema({
  createdAt: { type: Date, required: true },
  orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  discount: { type: Number, default: 0 },
});

export default {
  schema: gql`
    type CustomerVoucherLog {
      "Mã log"
      _id: ID
      "Ngày log"
      createdAt: DateTime
      "Mã đơn hàng"
      orderId: ID
      "Giảm giá"
      discount: Float

      order: Order
    }
  `,
  resolver: {
    CustomerVoucherLog: {
      order: GraphQLHelper.loadById(OrderLoader, "orderId"),
    },
  },
};
