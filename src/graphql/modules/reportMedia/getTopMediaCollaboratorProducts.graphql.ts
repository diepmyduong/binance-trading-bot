import { gql } from "apollo-server-express";
import { ROLES } from "../../../constants/role.const";
import { Context } from "../../context";
import { CollaboratorProductModel } from "../collaboratorProduct/collaboratorProduct.model";
import { getMatch } from "./common";

export default {
  schema: gql`
    extend type Query {
      getTopMediaCollaboratorProducts(
        query: GetTopMediaCollaboratorProductsInput!
      ): MediaCollaboratorProducts
    }
    input GetTopMediaCollaboratorProductsInput {
      sellerIds: [ID]
      branchId: ID
    }
    type MediaCollaboratorProducts {
      mostLikeProducts: [CollaboratorProduct]
      mostShareProducts: [CollaboratorProduct]
      mostCommentProducts: [CollaboratorProduct]
      mostViewProducts: [CollaboratorProduct]
    }
  `,
  resolver: {
    Query: {
      getTopMediaCollaboratorProducts: async (root: any, args: any, context: Context) => {
        context.auth(ROLES.ADMIN_EDITOR_MEMBER);
        const { sellerIds, branchId } = args.query;
        const $match = await getMatch(context, branchId, sellerIds);
        const [
          mostLikeProducts,
          mostShareProducts,
          mostCommentProducts,
          mostViewProducts,
        ] = await Promise.all([
          getMostLikeProducts($match),
          getMostShareProducts($match),
          getMostCommentProducts($match),
          getMostViewProducts($match),
        ]);

        return {
          mostLikeProducts,
          mostShareProducts,
          mostCommentProducts,
          mostViewProducts,
        };
      },
    },
  },
};

function getMostViewProducts($match: any): any[] | PromiseLike<any[]> {
  const query = [{ $match: $match }, { $sort: { clickCount: -1 } }, { $limit: 5 }];
  return CollaboratorProductModel.aggregate(query);
}

function getMostCommentProducts($match: any): any[] | PromiseLike<any[]> {
  return CollaboratorProductModel.aggregate([
    { $match: $match },
    { $sort: { commentCount: -1 } },
    { $limit: 5 },
  ]);
}

function getMostShareProducts($match: any): any[] | PromiseLike<any[]> {
  return CollaboratorProductModel.aggregate([
    { $match: $match },
    { $sort: { shareCount: -1 } },
    { $limit: 5 },
  ]);
}

async function getMostLikeProducts($match: any) {
  return await CollaboratorProductModel.aggregate([
    { $match: $match },
    { $sort: { likeCount: -1 } },
    { $limit: 5 },
  ]);
}
