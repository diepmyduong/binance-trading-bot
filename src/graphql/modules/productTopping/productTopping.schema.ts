import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getAllProductTopping(q: QueryGetListInput): ProductToppingPageData
    getOneProductTopping(id: ID!): ProductTopping
    # Add Query
  }

  extend type Mutation {
    createProductTopping(data: CreateProductToppingInput!): ProductTopping
    updateProductTopping(id: ID!, data: UpdateProductToppingInput!): ProductTopping
    deleteOneProductTopping(id: ID!): ProductTopping
    # Add Mutation
  }

  input CreateProductToppingInput {
    "Tên Topping"
    name: String!
  }

  input UpdateProductToppingInput {
    "Tên Topping"
    name: String
    "Bắt buộc"
    required: Boolean
    "Số lượng chọn tối thiểu"
    min: Int
    "Số lượng chọn tối đa"
    max: Int
    "Những lựa chọn"
    options: [ToppingOptions]
  }

  type ProductTopping {
    id: String
    createdAt: DateTime
    updatedAt: DateTime

    "Mã chủ shop"
    memberId: ID
    "Tên Topping"
    name: String
    "Bắt buộc"
    required: Boolean
    "Số lượng chọn tối thiểu"
    min: Int
    "Số lượng chọn tối đa"
    max: Int
    "Những lựa chọn"
    options: [ToppingOptions]
  }

  type ProductToppingPageData {
    data: [ProductTopping]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
