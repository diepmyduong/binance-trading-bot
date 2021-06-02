import { gql } from "apollo-server-express";
import { get, set, sumBy } from "lodash";
import { Types } from "mongoose";
import { Context } from "../../context";
import { CollaboratorProductModel } from "../collaboratorProduct/collaboratorProduct.model";
import { MemberModel } from "../member/member.model";
import { OrderItemModel } from "../orderItem/orderItem.model";

export default {
  schema: gql`
    extend type Query {
      getOverviewAllCollaboratorProducts(branchId: ID, sellerIds: [ID]): OverviewMediaProductStats
    }
    type OverviewMediaProductStats {
      clickCount: Int
      shareCount: Int
      likeCount: Int
      commentCount: Int
      order: Int
      completeOrder: Int
      uncompleteOrder: Int
      completeProductQty: Int
      uncompleteProductQty: Int
    }
  `,
  resolver: {
    Query: {
      getOverviewAllCollaboratorProducts: async (root: any, args: any, context: Context) => {
        const { sellerIds, branchId } = args;
        const $match = await getMatch(context, branchId, sellerIds);
        const products = await CollaboratorProductModel.aggregate([
          { $match: $match },
          {
            $group: {
              _id: "$productId",
              clickCount: { $sum: "$clickCount" },
              likeCount: { $sum: "$likeCount" },
              shareCount: { $sum: "$shareCount" },
              commentCount: { $sum: "$commentCount" },
            },
          },
        ]);
        const productIds = products.map((p) => Types.ObjectId(p._id));
        const orderStats = await getOrderStats(productIds);
        return {
          clickCount: sumBy(products, "clickCount"),
          shareCount: sumBy(products, "shareCount"),
          likeCount: sumBy(products, "likeCount"),
          commentCount: sumBy(products, "commentCount"),
          ...orderStats,
        };
      },
    },
  },
};

async function getOrderStats(productIds: Types.ObjectId[]) {
  const statusComplete = { $in: ["$status", ["COMPLETED"]] };
  const statusUncomplete = { $in: ["$status", ["PENDING", "CONFIRMED", "DELIVERING"]] };
  const query: any = [
    { $match: { productIds: { $in: productIds } } },
    {
      $group: {
        _id: "$orderId",
        productQty: { $sum: "$qty" },
        status: { $first: "$status" },
      },
    },
    {
      $group: {
        _id: null,
        order: { $sum: 1 },
        completeOrder: { $sum: { $cond: [statusComplete, 1, 0] } },
        uncompleteOrder: { $sum: { $cond: [statusUncomplete, 1, 0] } },
        completeProductQty: { $sum: { $cond: [statusComplete, "$productQty", 0] } },
        uncompleteProductQty: { $sum: { $cond: [statusUncomplete, "$productQty", 0] } },
      },
    },
  ];
  const orderStats = await OrderItemModel.aggregate(query).then((res) =>
    get(res, "0", {
      order: 0,
      completeOrder: 0,
      uncompleteOrder: 0,
      completeProductQty: 0,
      uncompleteProductQty: 0,
    })
  );
  return orderStats;
}

async function getMatch(context: Context, branchId: any, sellerIds: any) {
  const $match: any = {};
  if (context.isMember()) {
    set($match, "memberId.$in", [Types.ObjectId(context.id)]);
  } else if (branchId) {
    const memberIds = await MemberModel.find({ branchId, activated: true })
      .select("_id")
      .then((res) => res.map((r) => r._id));
    set($match, "memberId.$in", memberIds);
  } else if (sellerIds?.length) {
    set($match, "memberId.$in", sellerIds.map(Types.ObjectId));
  }
  return $match;
}
