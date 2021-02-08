import { gql } from "apollo-server-express";

export default gql`
  extend type Mutation {
    signUpMember(data: SignUpMemberInput!): MemberLoginData
  }
  input SignUpMemberInput {
    username: String!
    password: String!
    name: String!
    phone: String!
    shopName: String
    address: String
    provinceId: String
    districtId: String
    wardId: String
    identityCardNumber: String
    gender: String
    birthday: DateTime
    psid: String

    inviteCode: String
  }
`;
