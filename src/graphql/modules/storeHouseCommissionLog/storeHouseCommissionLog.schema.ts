import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getAllStoreHouseCommissionLog(q: QueryGetListInput): StoreHouseCommissionLogPageData
    getOneStoreHouseCommissionLog(id: ID!): StoreHouseCommissionLog
    getFilteredStoreHouseCommissionLog(q: QueryGetListInput): FilteredStorehouseCommissionLogPageData
    getOverviewStoreHouseCommissionLog(q: QueryGetListInput): OverviewStorehouseCommissionLogReport
    # Add Query
  }

	# "_id" : ObjectId("604605564abbf395f59dd814"),
	# "orderId" : ObjectId("6041f4537acdacaa9fecbb03"),
	# "value" : 5000,
	# "addressDeliveryId" : ObjectId("604088b3e475f6191dcfa1f2"),
	# "memberId" : ObjectId("6038b734ab0f5a2cfe0f4882"),

  type OverviewStorehouseCommissionLogReport{
    commission: Float
    memberCount: Int
  }

  type FilteredStorehouseCommissionLog {
    phone: String
    addressDeliveryId: String
    addressDelivery: AddressDelivery
    memberId: String
    member: Member
    orderIds: [ID]
    orders: [Order]
    total:Float
  }

  type FilteredStorehouseCommissionLogPageData {
    data: [FilteredStorehouseCommissionLog]
    total: Int
    pagination: Pagination
  }

  extend type Mutation {
    deleteOneStoreHouseCommissionLog(id: ID!): StoreHouseCommissionLog
    # Add Mutation
  }

  input CreateStoreHouseCommissionLogInput {
    name: String
  }

  input UpdateStoreHouseCommissionLogInput {
    name: String
  }

  type StoreHouseCommissionLog {
    id: String    
    createdAt: DateTime
    updatedAt: DateTime

    name: String
  }

  type StoreHouseCommissionLogPageData {
    data: [StoreHouseCommissionLog]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
