import { gql } from "apollo-server-express";
import { CollaboratorStatus } from "./collaborator.model";

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
    trackCollaboratorUrlEngagement(id: String!, accessToken: String): [Collaborator]
    # Add Mutation
  }

  input CreateCollaboratorInput {
    "mã cộng t ác viên"
    code: String
    "Tên cộng tác viên"
    name: String!
    "Số điện thoại"
    phone: String!
  }

  input UpdateCollaboratorInput {
    "mã cộng tác viên"
    code: String
    "Tên cộng tác viên"
    name: String
    "Số điện thoại"
    phone: String
    "Trạng thái ${Object.values(CollaboratorStatus)}"
    status: String
  }

  type Collaborator {
    id: String
    createdAt: DateTime
    updatedAt: DateTime

    "mã cộng tác viên"
    code: String
    "Tên cộng tác viên"
    name: String
    "Số điện thoại"
    phone: String
    "Chủ shop"
    memberId: ID
    "khách hàng"
    customerId: ID
    "Mã giới thiệu"
    shortCode: String
    "Lượt click"
    clickCount: Int
    "Lượt like"
    likeCount: Int
    "Lượt share"
    shareCount: Int
    "Lượt comment"
    commentCount: Int
    "Lượt tương tác"
    engagementCount: Int
    "Trạng thái ${Object.values(CollaboratorStatus)}"
    status: String

    member: Member
    customer: Customer
  }

  type CollaboratorPageData {
    data: [Collaborator]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
