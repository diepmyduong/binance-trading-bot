import { gql } from "apollo-server-express";
import { ROLES } from "../../../constants/role.const";
import { Context } from "../../context";
import { MemberModel } from "./member.model";

export default {
  schema: gql`
    extend type Mutation {
      deleteSubscriber(psid: String!): Member
    }
  `,
  resolver: {
    Mutation: {
      deleteSubscriber: async (root: any, args: any, context: Context) => {
        context.auth([ROLES.MEMBER]);
        const { psid } = args;
        return MemberModel.findOneAndUpdate(
          { _id: context.id },
          { $pull: { psids: psid } },
          { new: true }
        );
      },
    },
  },
};
