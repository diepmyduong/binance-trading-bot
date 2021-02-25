import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getAllCollaboratorImportingLog(q: QueryGetListInput): CollaboratorImportingLogPageData
    getOneCollaboratorImportingLog(id: ID!): CollaboratorImportingLog
    # Add Query
  }


  type CollaboratorImportingLog {
    id: String    
    createdAt: DateTime
    updatedAt: DateTime

    name: String
  }

  type CollaboratorImportingLogPageData {
    data: [CollaboratorImportingLog]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
