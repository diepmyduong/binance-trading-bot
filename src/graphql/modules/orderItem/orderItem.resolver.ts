import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { CampaignLoader } from "../campaign/campaign.model";
import { CampaignSocialResultLoader } from "../campaignSocialResult/campaignSocialResult.model";
import { ProductLoader } from "../product/product.model";

const OrderItem = {
  product: GraphQLHelper.loadById(ProductLoader, "productId"),
  campaign: GraphQLHelper.loadById(CampaignLoader, "campaignId"),
  campaignSocialResult: GraphQLHelper.loadById(CampaignSocialResultLoader, "campaignSocialResultId")
};

export default {
  OrderItem,
};
