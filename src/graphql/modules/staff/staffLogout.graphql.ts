import { gql } from "apollo-server-express";
import { Context } from "../../context";

export default {
  schema: gql`
    extend type Query {
      staffLogout: Mixed
    }
  `,
  resolver: {
    Query: {
      staffLogout: async (root: any, args: any, context: Context) => {
      }
    },
  },
};
