import { gql } from "apollo-server-express";

import { NotificationTarget, NotificationType } from "./notification.model";

const schema = gql`
  extend type Query {
    getAllNotification(q: QueryGetListInput): NotificationPageData
    getOneNotification(id: ID!): Notification
    # Add Query
  }

  extend type Mutation {
    testFCM(deviceToken: String, title: String, body: String, data: Mixed): Mixed
    readAllNotification: Boolean
    readNotification(notificationId: ID!): Notification
    # Add Mutation
  }
  type Notification {
    id: String
    createdAt: DateTime
    updatedAt: DateTime

    "Gửi tới ${Object.values(NotificationTarget)}"
    target: String
    "Mã chủ shop"
    memberId: ID
    "Mã nhân viên"
    staffId: ID
    "Mã khách hàng"
    customerId: ID
    "Tiêu đề thông báo"
    title: String
    "Nội dung thông báo"
    body: String
    "Loại thông báo ${Object.values(NotificationType)}"
    type: String
    "Đã xem"
    seen: Boolean
    "Ngày xem"
    seenAt: DateTime
    "Hình ảnh"
    image: String
    "Ngày gửi"
    sentAt: DateTime
    "Mã đơn hàng"
    orderId: ID
    "Mã sản phẩm"
    productId: ID
    "Link website"
    link: String

    member: Member
    staff: Staff
    customer: Customer
    order: Order
    product: Product
  }

  type NotificationPageData {
    data: [Notification]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
