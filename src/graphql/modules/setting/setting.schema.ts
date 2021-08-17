import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getAllSetting(q: QueryGetListInput): SettingPageData
    getOneSetting(id: ID!): Setting
    getOneSettingByKey(key: String!): Setting
  }

  extend type Mutation {
    updateSetting(id: ID!, data: UpdateSettingInput!): Setting
  }

  input UpdateSettingInput {
    value: Mixed
  }

  type Setting {
    id: String
    type: String
    name: String
    key: String
    value: Mixed
    isActive: Boolean
    isPrivate: Boolean
    isSecret: Boolean
    groupId: String
    createdAt: DateTime
    updatedAt: DateTime

    group: SettingGroup
  }

  type SettingPageData {
    data: [Setting]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
