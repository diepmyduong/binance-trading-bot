import { gql } from "apollo-server-express";
import { Schema } from "mongoose";
import { Context } from "../../context";
import { UserRole } from "../user/user.model";

export type Owner = {
  _id?: string; // Mã người dùng
  name?: string; // Tên
  email?: string; // Email
  phone?: string; // Điện thoại
  role?: UserRole; // Vai trò
};

export const OwnerSchema = new Schema({
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  role: { type: String },
});

export default {
  schema: gql`
    type Owner {
      "Mã người dùng"
      id: ID
      "Tên"
      name: String
      "Email"
      email: String
      "Điện thoại"
      phone: String
      "Vai trò"
      role: String
    }
  `,
  resolver: {
    Owner: {
      id: (root: any, args: any, context: Context) => root._id.toString(),
    },
  },
};
