import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getAllReportCode: Mixed
    getReportData(option: Mixed, code: String!): Mixed
    getMemberShopReport(memberId: ID!): Report
    getOverviewReport: Report
  }

  type Report {
    charts: Mixed
  }
`;

export default schema;
