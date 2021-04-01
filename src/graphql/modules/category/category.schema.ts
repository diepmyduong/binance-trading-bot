import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getAllCategory(q: QueryGetListInput): CategoryPageData
    getOneCategory(id: ID!): Category
    getFilteringCategories: [Category]
  }

  extend type Mutation {
    createCategory(data: CreateCategoryInput!): Category
    updateCategory(id: ID!, data: UpdateCategoryInput!): Category
    deleteOneCategory(id: ID!): Category
    deleteManyCategory(ids: [ID]): Int
  }

  input CreateCategoryInput {
    name: String!
    code: String
  }

  input UpdateCategoryInput {
    name: String
    code: String
  }

  type Category {
    id: String
    createdAt: DateTime
    updatedAt: DateTime

    "Tên danh mục"
    name: String
    "Mã danh mục"
    code: String
    "Danh mục sản phẩm chính"
    isPrimary: Boolean
    "Mã thành viên quản lý danh mục"
    memberId: ID
  }

  type CategoryPageData {
    data: [Category]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
