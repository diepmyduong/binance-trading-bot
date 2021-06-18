import { Schema } from "mongoose";
import { gql } from "apollo-server-express";
export type ToppingOption = {
  name?: string; // Tên option
  price?: number; // Giá
  isDefault?: boolean; // Lựa chọn mặc định
};
export const ToppingOptionSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, default: 0, min: 0 },
  isDefault: { type: Boolean, default: false },
});
export default gql`
  type ToppingOption {
    "Tên option"
    name: String
    "Giá"
    price: Float
    "Lựa chọn mặc định"
    isDefault: Boolean
  }
  input ToppingOptionInput {
    "Tên option"
    name: String
    "Giá"
    price: Float
    "Lựa chọn mặc định"
    isDefault: Boolean
  }
`;
