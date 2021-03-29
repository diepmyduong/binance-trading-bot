import { gql } from "apollo-server-express";

export default gql`
    extend type Query {
        getMemberTypes: [MemberType]
    }

    type MemberType {
        "Loại"
        type: String
        "tên"
        name: String
    }
`;
