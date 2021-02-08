import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getAllAddress(q: QueryGetListInput): AddressPageData
    getOneAddress(id: ID!): Address
    getProvince: [ProvinceData]
    getDistrict(provinceId: String!): [DistrictData]
    getWard(districtId: String!): [WardData]
  }

  extend type Mutation {
    createAddress(data: CreateAddressInput!): Address
    updateAddress(id: ID!, data: UpdateAddressInput!): Address
    deleteOneAddress(id: ID!): Address
    deleteManyAddress(ids: [ID]): Int
  }

  type ProvinceData {
    id: String
    province: String
  }
  type DistrictData {
    id: String
    district: String
  }
  type WardData {
    id: String
    ward: String
  }

  input CreateAddressInput {
    province: String
    provinceId: String
    district: String
    districtId: String
    ward: String
    wardId: String
  }

  input UpdateAddressInput {
    province: String
    provinceId: String
    district: String
    districtId: String
    ward: String
    wardId: String
  }

  type Address {
    id: String
    province: String
    provinceId: String
    district: String
    districtId: String
    ward: String
    wardId: String
    createdAt: DateTime
    updatedAt: DateTime
  }

  type AddressPageData {
    data: [Address]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
