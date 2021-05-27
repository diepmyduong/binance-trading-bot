import { gql } from "apollo-server-express";

const schema = gql`
  extend type Mutation {
    updateShopConfig(id: ID!, data: UpdateShopConfigInput!): ShopConfig
    # Add Mutation
  }

  input UpdateShopConfigInput {
    "Token vnpost"
    # vnpostToken: String
    empty: Mixed
  }

  type ShopConfig {
    id: String
    createdAt: DateTime
    updatedAt: DateTime

    "Mã chủ shop"
    memberId: ID
    "Mã CRM VNPost"
    vnpostCode: String
    "Điện thoại VNPost"
    vnpostPhone: String
    "Tên người dùng VNPost"
    vnpostName: String
  }
`;

export default schema;
