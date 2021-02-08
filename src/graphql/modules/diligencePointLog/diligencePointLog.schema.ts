import { gql } from "apollo-server-express";
import { DiligencePointLogType } from "./diligencePointLog.model";

const schema = gql`
  extend type Query {
    getAllDiligencePointLog(q: QueryGetListInput): DiligencePointLogPageData
    getOneDiligencePointLog(id: ID!): DiligencePointLog
  }

  extend type Mutation {
    createDiligencePointLog(data: CreateDiligencePointLogInput!): DiligencePointLog
    updateDiligencePointLog(id: ID!, data: UpdateDiligencePointLogInput!): DiligencePointLog
    importCsvForAddDiligencePoint(csvFile: Upload!): Mixed
    importDiligencePoints(file: Upload!): String
  }

  input CreateDiligencePointLogInput {
    memberId: ID!
    value: Int!
    note: String!
  }

  input UpdateDiligencePointLogInput {
    memberId: ID!
    value: Int!
    note: String!
  }

  type DiligencePointLog {
    id: String
    "Mã thành viên"
    memberId: ID
    "Giá trị"
    value: Int
    "Loại điểm chuyên cần ${Object.values(DiligencePointLogType)}"
    type: String
    "Ghi chú"
    note: String

    createdAt: DateTime
    updatedAt: DateTime
    member: Member
  }

  type DiligencePointLogPageData {
    data: [DiligencePointLog]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
