import { gql } from "apollo-server-express";
export default gql`
    extend type Query {
        getCommissionTypes: [CommissionType]
    }
    type CommissionType {
        "Loại"
        type: String
        "Tên"
        name: String
       
    }
`;
