import { gql } from "apollo-server-express";

export default gql`
    type CampaignOrderStats {
        total: Int
        completed: Int
        canceled: Int
        pending: Int
    }
`