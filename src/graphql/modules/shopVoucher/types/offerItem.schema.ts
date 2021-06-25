import { gql } from "apollo-server-express";
import { Schema } from "mongoose";

export type OfferItem = {
  productId?: string; // Mã sản phẩm
  qty?: number; // Số lượng sản phẩm
  note?: string; // Ghi chú
};

export const OfferItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  qty: { type: Number, required: true, min: 1 },
  note: { type: String },
});

export default gql`
  type OfferItem {
    "Mã sản phẩm"
    productId: ID
    "Số lượng sản phẩm"
    qty: Int
    "Ghi chú"
    note: String

    product: Product
  }

  input OfferItemInput {
    "Mã sản phẩm"
    productId: ID!
    "Số lượng sản phẩm"
    qty: Int!
    "Ghi chú"
    note: String
  }
`;
