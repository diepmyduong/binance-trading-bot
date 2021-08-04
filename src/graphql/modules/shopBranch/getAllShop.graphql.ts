import { gql } from "apollo-server-express";
import LocalBroker from "../../../services/broker";
import { Context } from "../../context";
import { IShopConfig } from "../shopConfig/shopConfig.model";
import { ShopBranchModel } from "./shopBranch.model";

export default {
  schema: gql`
    extend type Query {
      getAllShop(lat: Float!, lng: Float!): [PublicShop]
    }
    type PublicShop {
      id: ID
      coverImage: String
      name: String
      fullAddress: String
      distance: Float
      rating: Float
      ratingQty: Float
      shopCode: String
    }
  `,
  resolver: {
    Query: {
      getAllShop: async (root: any, args: any, context: Context) => {
        const { lat, lng } = args;
        return ShopBranchModel.aggregate([
          {
            $geoNear: {
              near: { type: "Point", coordinates: [lng, lat] },
              spherical: true,
              distanceField: "distance",
            },
          },
          { $match: { isOpen: true } },
          {
            $group: {
              _id: "$memberId",
              id: { $first: "$memberId" },
              coverImage: { $first: "$coverImage" },
              name: { $first: "$name" },
              fullAddress: {
                $first: {
                  $concat: ["$address", ", ", "$ward", ", ", "$district", ", ", "$province"],
                },
              },
              distance: { $first: "$distance" },
            },
          },
          { $lookup: { from: "members", localField: "_id", foreignField: "_id", as: "member" } },
          { $unwind: "$member" },
          {
            $project: {
              id: 1,
              coverImage: 1,
              name: { $concat: ["$member.shopName", " - ", "$name"] },
              fullAddress: 1,
              distance: 1,
              shopCover: "$member.shopCover",
              shopLogo: "$member.shopLogo",
              shopCode: "$member.code",
            },
          },
        ]);
      },
    },
    PublicShop: {
      distance: async (root: any, args: any, context: Context) => {
        return parseFloat((root.distance / 1000).toFixed(1));
      },
      coverImage: async (root: any, args: any, context: Context) => {
        return root.coverImage || root.shopCover || root.shopLogo;
      },
      rating: async (root: any, args: any, context: Context) => {
        const shopConfig: IShopConfig = await LocalBroker.call("shopConfig.get", {
          id: root.id.toString(),
        });
        return shopConfig.rating;
      },
      ratingQty: async (root: any, args: any, context: Context) => {
        const shopConfig: IShopConfig = await LocalBroker.call("shopConfig.get", {
          id: root.id.toString(),
        });
        return shopConfig.ratingQty;
      },
    },
  },
};
