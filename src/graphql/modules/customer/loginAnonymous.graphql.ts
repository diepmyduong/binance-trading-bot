import { gql } from "apollo-server-express";
import { Types } from "mongoose";
import { ErrorHelper } from "../../../base/error";
import { ROLES } from "../../../constants/role.const";
import { TokenHelper } from "../../../helpers/token.helper";
import { Context } from "../../context";
import { MemberModel } from "../member/member.model";

export default {
  schema: gql`
    extend type Mutation {
      loginAnonymous(shopCode: String!): String
    }
  `,
  resolver: {
    Mutation: {
      loginAnonymous: async (root: any, args: any, context: Context) => {
        const { shopCode } = args;
        const shop = await MemberModel.findOne({ code: shopCode });
        if (!shop) throw ErrorHelper.permissionDeny();
        return TokenHelper.generateToken({
          role: ROLES.ANONYMOUSE,
          _id: Types.ObjectId().toHexString(),
          memberId: shop._id,
          username: "Khách vãng lai",
        });
      },
    },
  },
};
