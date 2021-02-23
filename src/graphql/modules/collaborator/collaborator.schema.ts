import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getAllCollaborator(q: QueryGetListInput): CollaboratorPageData
    getOneCollaborator(id: ID!): Collaborator
    # Add Query
  }

  extend type Mutation {
    createCollaborator(data: CreateCollaboratorInput!): Collaborator
    updateCollaborator(id: ID!, data: UpdateCollaboratorInput!): Collaborator
    deleteOneCollaborator(id: ID!): Collaborator
    # Add Mutation
  }

  input CreateCollaboratorInput {
    name: String
  }

  input UpdateCollaboratorInput {
    name: String
  }

  type Collaborator {
    id: String    
    createdAt: DateTime
    updatedAt: DateTime

    name: String
  }

  type CollaboratorPageData {
    data: [Collaborator]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
