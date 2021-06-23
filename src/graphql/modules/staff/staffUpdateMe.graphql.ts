import { gql } from "apollo-server-express";
import { ROLES } from "../../../constants/role.const";
import { Context } from "../../context";
import { StaffModel } from "./staff.model";

export default {
  schema: gql`
    extend type Mutation {
      staffUpdateMe(data: UpdateStaffInput!): Staff
    }
  `,
  resolver: {
    Mutation: {
      staffUpdateMe: async (root: any, args: any, context: Context) => {
        context.auth([ROLES.STAFF]);
        const { data } = args;
        return await StaffModel.findByIdAndUpdate(context.id, { $set: data }, { new: true });
      },
    },
  },
};
