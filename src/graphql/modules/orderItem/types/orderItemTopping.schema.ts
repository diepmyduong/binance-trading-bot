import { gql } from "apollo-server-express";
import { Schema } from "mongoose";

export type OrderItemTopping = {
  toppingId?: string; // Mã topping
  toppingName?: string; // Tên topping
  optionName?: string; // Tên Tuỳ chọn
  price?: number; // Giá
};

export const OrderItemToppingSchema = new Schema({
  toppingId: { type: Schema.Types.ObjectId, ref: "ProductTopping", required: true },
  toppingName: { type: String, required: true },
  optionName: { type: String, required: true },
  price: { type: Number, default: 0, min: 0 },
});

export default gql`
  type OrderItemTopping {
    "Mã topping"
    toppingId: ID
    "Tên topping"
    toppingName: String
    "Tên Tuỳ chọn"
    optionName: String
    "Giá"
    price: Float
  };
  input OrderItemToppingInput {
    "Mã topping"
    toppingId: ID
    "Tên topping"
    toppingName: String
    "Tên Tuỳ chọn"
    optionName: String
    "Giá"
    price: Float
  };

  extend type OrderItem {
    "Topping kèm theo"
    toppings: [OrderItemTopping]
  }
`;
