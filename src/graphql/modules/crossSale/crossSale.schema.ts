import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getAllCrossSale(q: QueryGetListInput): CrossSalePageData
    getOneCrossSale(id: ID!): CrossSale
  }

  extend type Mutation {
    createCrossSale(productId: ID!): CrossSale
    deleteOneCrossSale(id: ID!): CrossSale
  }

  type CrossSale {
    id: String
    "Mã sản phẩm"
    productId: ID
    "Mã thanh vien ban"
    sellerId: ID
    createdAt: DateTime
    updatedAt: DateTime
    "Tên sản phẩm"
    productName: String

    product: Product
  }

  type CrossSalePageData {
    data: [CrossSale]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
