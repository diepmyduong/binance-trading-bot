import { gql } from "apollo-server-express";
import { Schema } from "mongoose";

export enum ActionType {
  WEBSITE = "WEBSITE", // Mở website
  POST = "POST", // Mở bài post
  NONE = "NONE", // Không hành động
}

export type Action = {
  type?: ActionType; // Loại hành động
  link?: string; // Đường dẫn website
  postId?: string; // Mã bài đăng
};

export const ActionSchema = new Schema({
  type: { type: String, enum: Object.values(ActionType) },
  link: { type: String },
  postId: { type: Schema.Types.ObjectId },
});

export default {
  schema: gql`
    type Action {
      "Loại hành động ${Object.values(ActionType)}"
      type: String
      "Đường dẫn website"
      link: String
      "Mã bài đăng"
      postId: ID
    }
    input ActionInput {
      "Loại hành động ${Object.values(ActionType)}"
      type: String!
      "Đường dẫn website"
      link: String
      "Mã bài đăng"
      postId: ID
    }
  `,
  resolver: {},
};
