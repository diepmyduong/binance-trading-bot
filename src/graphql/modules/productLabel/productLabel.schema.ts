import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getAllProductLabel(q: QueryGetListInput): ProductLabelPageData
    getOneProductLabel(id: ID!): ProductLabel
    # Add Query
  }

  extend type Mutation {
    createProductLabel(data: CreateProductLabelInput!): ProductLabel
    updateProductLabel(id: ID!, data: UpdateProductLabelInput!): ProductLabel
    deleteOneProductLabel(id: ID!): ProductLabel
    # Add Mutation
  }

  input CreateProductLabelInput {
    "Tên nhãn"
    name: String!
    "Màu sắc"
    color: String
  }

  input UpdateProductLabelInput {
    "Tên nhãn"
    name: String
    "Màu sắc"
    color: String
  }

  type ProductLabel {
    id: String
    createdAt: DateTime
    updatedAt: DateTime

    "Mã chủ shop"
    memberId: ID
    "Tên nhãn"
    name: String
    "Màu sắc"
    color: String
  }

  type ProductLabelPageData {
    data: [ProductLabel]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
