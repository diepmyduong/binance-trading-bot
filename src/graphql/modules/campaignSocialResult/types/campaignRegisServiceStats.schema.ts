import { gql } from "apollo-server-express";

export default gql`
    type CampaignRegisServiceStats {
        total: Int
        completed: Int
        canceled: Int
        pending: Int
    }
`