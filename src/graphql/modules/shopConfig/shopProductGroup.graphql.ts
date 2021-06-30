import { gql } from "apollo-server-express";
import { Schema } from "mongoose";
import { ROLES } from "../../../constants/role.const";
import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { Context } from "../../context";
import { ProductLoader } from "../product/product.model";
import { IShopConfig } from "./shopConfig.model";

export type ShopProductGroup = {
  name?: string; // Tên nhóm
  isPublic?: boolean; // Hiển thị công khai
  productIds?: string[]; // Danh sách sản phẩm
};

export const ShopProductGroupSchema = new Schema({
  name: { type: String, required: true },
  isPublic: { type: Boolean, default: false },
  productIds: { type: [{ type: Schema.Types.ObjectId, ref: "Product" }], default: [] },
});

export default {
  schema: gql`
    type ShopProductGroup {
      "Tên nhóm"
      name: String
      "Hiển thị công khai"
      isPublic: Boolean
      "Danh sách sản phẩm"
      productIds: [ID]

      products: [Product]
    }
    input ShopProductGroupInput {
      "Tên nhóm"
      name: String!
      "Hiển thị công khai"
      isPublic: Boolean
      "Danh sách sản phẩm"
      productIds: [ID]
    }
    extend type ShopConfig {
      productGroups: [ShopProductGroup]
    }
    extend input UpdateShopConfigInput {
      productGroups: [ShopProductGroupInput]
    }
  `,
  resolver: {
    ShopProductGroup: {
      products: GraphQLHelper.loadManyById(ProductLoader, "productIds"),
    },
    ShopConfig: {
      productGroups: async (root: IShopConfig, args: any, context: Context) => {
        context.auth(ROLES.ANONYMOUS_CUSTOMER_MEMBER_STAFF);
        if (!context.isMember()) {
          return root.productGroups.filter((g) => g.isPublic);
        } else {
          return root.productGroups;
        }
      },
    },
  },
};
