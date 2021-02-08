import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getAllBranch(q: QueryGetListInput): BranchPageData
    getOneBranch(id: ID!): Branch
  }

  extend type Mutation {
    createBranch(data: CreateBranchInput!): Branch
    updateBranch(id: ID!, data: UpdateBranchInput!): Branch
    deleteOneBranch(id: ID!): Branch
    deleteManyBranch(ids: [ID]): Int
  }

  input CreateBranchInput {
    name: String!
  }

  input UpdateBranchInput {
    name: String
  }

  type Branch {
    id: String
    "Tên chi nhánh"
    name: String
    createdAt: DateTime
    updatedAt: DateTime
  }

  type BranchPageData {
    data: [Branch]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
