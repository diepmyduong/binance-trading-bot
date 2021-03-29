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
    importCollaborators(file: Upload!): String
    trackCollaboratorUrlEngagement(id: String!, accessToken:String): [Collaborator]
    # Add Mutation
  }

  input CreateCollaboratorInput {
    code: String
    name: String!
    phone: String!
  }

  input UpdateCollaboratorInput {
    code: String
    name: String
    phone: String
  }

  type Collaborator {
    id: String    
    createdAt: DateTime
    updatedAt: DateTime
    
    "Mã Cộng tác viên"
    code: String
    "Tên cộng tác viên"
    name: String
    "Số điện thoại" 
    phone: String
    "Chủ shop"
    memberId: ID

    "Mã giới thiệu"
    shortCode: String
    "Link giới thiệu"
    shortUrl: String

    customer: Customer
    member: Member

    "Số lượng click"
    clickCount: Int
    "Số lượng like"
    likeCount: Int
    "Số lượng share"
    shareCount: Int
    "Số lượng comment"
    commentCount: Int
  }


  type CollaboratorPageData {
    data: [Collaborator]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
