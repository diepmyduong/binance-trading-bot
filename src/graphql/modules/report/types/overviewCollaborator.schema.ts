import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getFilteredCollaborators(q: QueryGetListInput): CollaboratorPageData
    getOverviewCollaboratorReport(q: QueryGetListInput): OverviewCollaboratorsReport
    # Add Query
  }

  type OverviewCollaboratorsReport {
    commission: Float
    collaboratorCount: Int
  }

  type FilteredCollaborator {
    code: String
    name: String
    phone: String
    memberIds: [ID]
    customerId: ID
    customer: Customer
    members: [Member]
    memberId: ID
    member: Member
    total: Float
  }

  type FilteredCollaboratorPageData {
    data: [FilteredCollaborator]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
