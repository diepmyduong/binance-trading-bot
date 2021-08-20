---
to: src/graphql/modules/<%= h.path(name) %>/<%= h.inflection.camelize(f, true) %>.graphql.ts
---
import { gql } from "apollo-server-express";
import { Context } from "<%= h.import(name, '../../context') %>";

export default {
  schema: gql`
    extend type Query {
      <%= h.inflection.camelize(f, true) %>: Mixed
    }
  `,
  resolver: {
    Query: {
      <%= h.inflection.camelize(f, true) %>: async (root: any, args: any, context: Context) => {
      }
    },
  },
};
