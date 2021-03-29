import { gql } from "apollo-server-express";

export default gql`
    extend type Query {
        getMemberCommissionTypes: [MemberCommissionType]
    }

    type MemberCommissionType {
        "Loại"
        type: String
        "Tên"
        name: String
    }
`;
