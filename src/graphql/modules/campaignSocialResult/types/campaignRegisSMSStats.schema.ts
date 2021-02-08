import { gql } from "apollo-server-express";

export default gql`
    type CampaignRegisSMSStats {
        total: Int
        completed: Int
        canceled: Int
        pending: Int
    }
`