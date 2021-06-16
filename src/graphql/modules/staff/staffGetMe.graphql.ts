import { gql } from "apollo-server-express";
import { ROLES } from "../../../constants/role.const";
import { Context } from "../../context";
import { StaffModel } from "./staff.model";

export default {
  schema: gql`
    extend type Query {
      staffGetMe: Staff
    }
  `,
  resolver: {
    Query: {
      staffGetMe: async (root: any, args: any, context: Context) => {
        context.auth([ROLES.STAFF]);
        return StaffModel.findById(context.id);
      },
    },
  },
};
