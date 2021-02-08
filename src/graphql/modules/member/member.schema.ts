import { gql } from "apollo-server-express";
import { Gender, MemberType } from "./member.model";

const schema = gql`
  extend type Query {
    getAllMember(q: QueryGetListInput): MemberPageData
    getOneMember(id: ID!): Member
    memberGetMe: Member
    getShopData: Shop
    searchSubscriber(query: String): [SubscriberInfo]
    # Add Query
  }

  extend type Mutation {
    createMember(data: CreateMemberInput!): Member
    updateMember(id: ID!, data: UpdateMemberInput!): Member
    deleteOneMember(id: ID!): Member
    deleteManyMember(ids: [ID]): Int
    loginMember(idToken: String!): MemberLoginData
    updateMemberPassword(memberId: ID!, password: String!): Member
    connectChatbot(apiKey: String!): Member
    memberUpdateMe(data: UpdateMemberInput!): Member
    setMemberPSID(memberId: ID!, psid: String!): Member
    generateChatbotStory(data: ChatbotStoryInput!): Member
    # Add Mutation
  }

  type MemberLoginData {
    member: Member
    token: String
  }
  
  type Shop {
    id: String
    "Mã chủ shop"
    username: String
    "UID Firebase"
    uid: String
    "Họ tên"
    name: String
    "Avatar"
    avatar: String
    "Điện thoại"
    phone: String
    "Mã Fanpage"
    fanpageId: String
    "Tên Fanpage"
    fanpageName: String
    "Hình Fanpage"
    fanpageImage: String
    "Tên cửa hàng"
    shopName: String
    "Logo cửa hàng"
    shopLogo: String
    "Địa chỉ"
    address: String
    "Mã Tỉnh/thành"
    provinceId: String
    "Mã Quận/huyện"
    districtId: String
    "Mã Phường/xã"
    wardId: String
    "Tỉnh/thành"
    province: String
    "Quận/huyện"
    district: String
    "Phường/xã"
    ward: String
  }

  input CreateMemberInput {
    username: String!
    name: String!
    avatar: String
    phone: String!
    shopName: String
    shopLogo: String
    address: String
    provinceId: String
    districtId: String
    wardId: String
    identityCardNumber: String
    gender: String
    birthday: DateTime
    parentIds: [ID]
    activated: Boolean
    type: String!
    branchId: ID!
    positionId: ID
    password: String!
  }

  input UpdateMemberInput {
    name: String
    avatar: String
    phone: String
    shopName: String
    shopLogo: String
    address: String
    provinceId: String
    districtId: String
    wardId: String
    identityCardNumber: String
    gender: String
    birthday: DateTime
    parentIds: [ID]
    activated: Boolean
    type: String
    branchId: ID
    positionId: ID
  }

  type Member {
    id: String
    createdAt: DateTime
    updatedAt: DateTime

    "Mã chủ shop"
    code: String
    "Tên đăng nhập"
    username: String
    "UID Firebase"
    uid: String
    "Họ tên"
    name: String
    "Avatar"
    avatar: String
    "Điện thoại"
    phone: String
    "Mã Fanpage"
    fanpageId: String
    "Tên Fanpage"
    fanpageName: String
    "Hình Fanpage"
    fanpageImage: String
    "Tên cửa hàng"
    shopName: String
    "Logo cửa hàng"
    shopLogo: String
    "Điểm tích lũy"
    cumulativePoint: Float
    "Điểm chuyên cần"
    diligencePoint: Float
    "Hoa hồng"
    commission: Float
    "Địa chỉ"
    address: String
    "Mã Tỉnh/thành"
    provinceId: String
    "Mã Quận/huyện"
    districtId: String
    "Mã Phường/xã"
    wardId: String
    "Tỉnh/thành"
    province: String
    "Quận/huyện"
    district: String
    "Phường/xã"
    ward: String
    "CMND"
    identityCardNumber: String
    "Giới tính ${Object.values(Gender)}"
    gender: String
    "Sinh nhật"
    birthday: DateTime
    "Mã người giới thiệu"
    parentIds: [ID]
    "Ngày đăng ký"
    activedAt: DateTime
    "Chủ shop đã kích hoạt"
    activated: Boolean
    "Loại chủ shop ${Object.values(MemberType)}"
    type: String
    "Mã chi nhánh"
    branchId: ID
    "Mã chức vụ"
    positionId: ID
    "Mã PSID ở trang Fanpage chính"
    psids: [String]
    "Kịch bản chatbot"
    chatbotStory: [ChatbotStory]

    branch: Branch
    position: Position
    parents: [Member]
    subscribers: [SubscriberInfo]
    "Đường dẫn mở inbox fanpage"
    chatbotRef: String
  }

  type MemberPageData {
    data: [Member]
    total: Int
    pagination: Pagination
  }
  
`;

export default schema;
