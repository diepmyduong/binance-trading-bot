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
  }

  input CreateCategoryInput {
    "Tên danh mục"
    name: String!
    "Mã danh mục"
    code: String
    "Mã sản phẩm"
    productIds: [ID]
    "Độ ưu tiên"
    priority: Int
  }

  input UpdateCategoryInput {
    "Tên danh mục"
    name: String
    "Mã danh mục"
    code: String
    "Mã sản phẩm"
    productIds: [ID]
    "Độ ưu tiên"
    priority: Int
  }

  type Category {
    id: String
    createdAt: DateTime
    updatedAt: DateTime

    "Mã thành viên quản lý danh mục"
    memberId: ID
    "Tên danh mục"
    name: String
    "Mã danh mục"
    code: String
    "Danh mục sản phẩm chính"
    isPrimary: Boolean
    "Mã sản phẩm"
    productIds: [ID]
    "Độ ưu tiên"
    priority: Int

    products: [Product]
  }

  type CategoryPageData {
    data: [Category]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
