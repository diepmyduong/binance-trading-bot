import { gql } from "apollo-server-express";
import { Schema } from "mongoose";
import { Context } from "../../context";

export type ShopTag = {
  name?: string; // Tên tag
  icon?: string; // Link icon
  qty?: number; // Số lượng
};

export const ShopTagSchema = new Schema({
  name: { type: String, required: true },
  icon: { type: String, required: true },
  qty: { type: Number, default: 0 },
});

export default {
  schema: gql`
    type ShopTag {
      "Tên tag"
      name: String
      "Link icon"
      icon: String
      "Số lượng"
      qty: Int
    }
    input ShopTagInput {
      "Tên tag"
      name: String!
      "Link icon"
      icon: String!
      "Số lượng"
      qty: Int!
    }
    extend type ShopConfig {
      tags: [ShopTag]
    }
    extend input UpdateShopConfigInput {
      tags: [ShopTagInput]
    }
  `,
  resolver: {},
};
