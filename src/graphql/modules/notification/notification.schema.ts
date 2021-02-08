import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getAllNotification(q: QueryGetListInput): NotificationPageData
    getOneNotification(id: ID!): Notification
  }

  extend type Mutation {
    createNotification(data: CreateNotificationInput!): Notification
    updateNotification(id: ID!, data: UpdateNotificationInput!): Notification
    deleteOneNotification(id: ID!): Notification
    deleteManyNotification(ids: [ID]): Int
    testFCM(deviceToken: String, title: String, body: String, data: Mixed): Mixed
    readAllNotification: Boolean
  }

  input CreateNotificationInput {
    _empty: Mixed
  }

  input UpdateNotificationInput {
    _empty: Mixed
  }

  type Notification {
    id: String
    userId: String
    memberId: String
    title: String
    body: String
    clickAction: String
    data: Mixed
    seen: Boolean
    seenAt: DateTime
    hash: String
    image: String
    createdAt: DateTime
    updatedAt: DateTime

    user: User
  }

  type NotificationPageData {
    data: [Notification]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
