import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getAllSettingGroup(q: QueryGetListInput): SettingGroupPageData
  }

  type SettingGroup {
    id: String
    slug: String
    name: String
    desc: String
    sort: Int
    settings: [Setting]
  }

  type SettingGroupPageData {
    data: [SettingGroup]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
