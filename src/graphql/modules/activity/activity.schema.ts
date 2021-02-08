import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getAllActivity(q: QueryGetListInput): ActivityPageData
    getOneActivity(id: ID!): Activity
  }

  extend type Mutation {
    createActivity(data: CreateActivityInput!): Activity
    updateActivity(id: ID!, data: UpdateActivityInput!): Activity
    deleteOneActivity(id: ID!): Activity
    deleteManyActivity(ids: [ID]): Int
  }

  input CreateActivityInput {
    username: String
    message: String
  }

  input UpdateActivityInput {
    username: String
    message: String
  }

  type Activity {
    id: String
    username: String
    message: String
    createdAt: DateTime
    updatedAt: DateTime
  }

  type ActivityPageData {
    data: [Activity]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
