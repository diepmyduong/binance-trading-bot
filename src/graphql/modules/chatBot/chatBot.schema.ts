import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getAllChatBot: String
  }
`;

export default schema;
