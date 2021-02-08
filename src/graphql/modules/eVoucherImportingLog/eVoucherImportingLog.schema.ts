import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getAllEVoucherImportingLog: String
    # Add Query
  }

`;

export default schema;
