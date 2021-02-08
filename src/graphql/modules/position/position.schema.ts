import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getAllPosition(q: QueryGetListInput): PositionPageData
    getOnePosition(id: ID!): Position
    # Add Query
  }

  extend type Mutation {
    createPosition(data: CreatePositionInput!): Position
    updatePosition(id: ID!, data: UpdatePositionInput!): Position
    deleteOnePosition(id: ID!): Position
    # Add Mutation
  }

  input CreatePositionInput {
    name: String
  }

  input UpdatePositionInput {
    name: String
  }

  type Position {
    id: String
    "Tên chúc vụ"
    name:String
    createdAt: DateTime
    updatedAt: DateTime
  }

  type PositionPageData {
    data: [Position]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
