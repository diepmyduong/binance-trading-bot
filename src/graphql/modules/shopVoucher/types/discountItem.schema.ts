import { gql } from "apollo-server-express";
import { Schema } from "mongoose";
export enum DiscountUnit {
  VND = "VND", // Tiền mặt
  PERCENT = "PERCENT", // Phần trăm
}
export type DiscountItem = {
  productId?: string; // Mã sản phẩm
  discountUnit?: DiscountUnit; // Đơn vị giảm giá
  discountValue?: number; // Giá trị giảm giá
  maxDiscount?: number; // Giảm giá tối đa
};
export const DiscountItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  discountUnit: { type: String, enum: Object.values(DiscountUnit) },
  discountValue: { type: Number, min: 0 },
  maxDiscount: { type: Number, min: 0 },
});
export default gql`
    input DiscountItemInput{
        "Mã sản phẩm"
        productId: ID!
        "Đơn vị giảm giá ${Object.values(DiscountUnit)}"
        discountUnit: String!
        "Giá trị giảm giá"
        discountValue: Float!
        "Giảm giá tối đa"
        maxDiscount: Float!
    }
    type DiscountItem{
        "Mã sản phẩm"
        productId: ID
        "Đơn vị giảm giá ${Object.values(DiscountUnit)}"
        discountUnit: String
        "Giá trị giảm giá"
        discountValue: Float
        "Giảm giá tối đa"
        maxDiscount: Float

        product: Product
    }
`;
