import { gql } from "apollo-server-express";
import { Context } from "../../context";
import { MemberModel } from "./member.model";

export default {
  schema: gql`
    extend type Query {
      getShopDataByCustomer(memberIds: [ID]!): [Member]
    }
  `,
  resolver: {
    Query: {
      getShopDataByCustomer: async (root: any, args: any, context: Context) => {
        const { memberIds } = args;
        const members = await MemberModel.find({ _id: { $in: memberIds } }).select(
          "_id addressDeliveryIds address provinceId districtId wardId province district ward code shopName shopLogo mainAddressStorehouseId isPost"
        );
        return members;
      },
    },
  },
};
