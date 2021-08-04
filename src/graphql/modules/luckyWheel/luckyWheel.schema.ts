import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getAllLuckyWheel(q: QueryGetListInput): LuckyWheelPageData
    getOneLuckyWheel(id: ID!): LuckyWheel
    # Add Query
  }

  extend type Mutation {
    createLuckyWheel(data: CreateLuckyWheelInput!): LuckyWheel
    updateLuckyWheel(id: ID!, data: UpdateLuckyWheelInput!): LuckyWheel
    deleteOneLuckyWheel(id: ID!): LuckyWheel
    # deleteOneLuckyWheel(id: ID!): LuckyWheel
    # Add Mutation
  }

  input CreateLuckyWheelInput {
    "Mã vòng quay"
    code: String
    "Tiêu đề vòng quay"
    title: String!
    "ngày bắt đầu"
    startDate: DateTime!
    "ngày kết thúc"
    endDate: DateTime!
  }

  input UpdateLuckyWheelInput {
    "Mã vòng quay"
    code: String
    "Tiêu đề vòng quay"
    title: String
    "màu nền vòng quay"
    backgroundColor: String
    "hình nền vòng quay"
    backgroundImage: String
    "màu nút"
    buttonColor: String
    "ảnh banner"
    bannerImage: String
    "ảnh footer"
    footerImage: String
    "ảnh vòng quay"
    wheelImage: String
    "ảnh pin"
    pinImage: String
    "tiêu đề nút quay"
    btnTitle: String
    "ngày bắt đầu"
    startDate: DateTime
    "ngày kết thúc"
    endDate: DateTime
    "tỉ lệ thắng"
    successRatio: Int
    "Điểm chơi game được yêu cầu"
    gamePointRequired: Int
    "danh sách món quà"
    gifts: [GiftInput]
    "Kích hoạt"
    isActive: Boolean
    "Cấu hình thiết kế vòng quay"
    designConfig: Mixed
    "Số lượng phát hành"
    issueNumber: Int
    "Phát hành mỗi ngày"
    issueByDate: Boolean
    "Số lượng sử dụng / mỗi khách"
    useLimit: Int
    "Số lượng sử dụng theo ngày"
    useLimitByDate: Boolean
  }

  type LuckyWheel {
    id: String
    createdAt: DateTime
    updatedAt: DateTime

    "Mã chủ shop"
    memberId: ID
    "Mã vòng quay"
    code: String
    "Tiêu đề vòng quay"
    title: String
    "màu nền vòng quay"
    backgroundColor: String
    "hình nền vòng quay"
    backgroundImage: String
    "màu nút"
    buttonColor: String
    "ảnh banner"
    bannerImage: String
    "ảnh footer"
    footerImage: String
    "ảnh vòng quay"
    wheelImage: String
    "ảnh pin"
    pinImage: String
    "tiêu đề nút quay"
    btnTitle: String
    "ngày bắt đầu"
    startDate: DateTime
    "ngày kết thúc"
    endDate: DateTime
    "tỉ lệ thắng"
    successRatio: Int
    "Điểm chơi game được yêu cầu"
    gamePointRequired: Int
    "danh sách món quà"
    gifts: [Gift]
    "Kích hoạt"
    isActive: Boolean
    "Cấu hình thiết kế vòng quay"
    designConfig: Mixed
    "Số lượng phát hành"
    issueNumber: Int
    "Phát hành mỗi ngày"
    issueByDate: Boolean
    "Số lượng sử dụng / mỗi khách"
    useLimit: Int
    "Số lượng sử dụng theo ngày"
    useLimitByDate: Boolean
    "Vong quay riêng tư"
    isPrivate: Boolean
  }

  type LuckyWheelPageData {
    data: [LuckyWheel]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
