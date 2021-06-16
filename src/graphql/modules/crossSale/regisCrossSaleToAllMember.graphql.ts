import { gql } from "apollo-server-express";
import { ROLES } from "../../../constants/role.const";
import { Context } from "../../context";
import { MemberModel } from "../member/member.model";
import { ProductModel } from "../product/product.model";
import { CrossSaleModel } from "./crossSale.model";
import { getCrossSaleProduct } from "./lib/common";

export default {
  schema: gql`
    extend type Mutation {
      regisCrossSaleToAllMember(productId: ID!): String
    }
  `,
  resolver: {
    Mutation: {
      regisCrossSaleToAllMember: async (root: any, args: any, context: Context) => {
        context.auth(ROLES.ADMIN_EDITOR);
        const { productId } = args;
        const [product, members] = await Promise.all([
          getCrossSaleProduct(productId),
          MemberModel.find().select("_id").exec(),
        ]);
        const bulk = CrossSaleModel.collection.initializeUnorderedBulkOp();
        for (const m of members) {
          bulk
            .find({ productId: product._id, sellerId: m._id })
            .upsert()
            .updateOne({
              $setOnInsert: {
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              $set: { productName: product.name, allowSale: true },
            });
        }
        if (bulk.length > 0) {
          await bulk.execute();
        }
        return `Đã đăng ký cho ${members.length} cửa hàng.`;
      },
    },
  },
};
