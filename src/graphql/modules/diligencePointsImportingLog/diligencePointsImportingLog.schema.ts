import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getAllDiligencePointsImportingLog: String
    # Add Query
  }
`;

export default schema;
