import { ROLES } from "../../../constants/role.const";
import { AuthHelper, ErrorHelper } from "../../../helpers";
import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { Context } from "../../context";
import { CampaignLoader } from "../campaign/campaign.model";
import { MemberLoader } from "../member/member.model";
import { OrderStatus } from "../order/order.model";
import { IOrderItem, OrderItemLoader } from "../orderItem/orderItem.model";
import { RegisSMSLoader } from "../regisSMS/regisSMS.model";
import { ICampaignSocialResult, MessageReceivingStatus } from "./campaignSocialResult.model";
import { campaignSocialResultService } from "./campaignSocialResult.service";
import { CampaignOrderStats } from "./loader/campaignOrderStats.loader";
import { CampaignRegisServiceStats } from "./loader/campaignRegisServiceStats.loader";
import { CampaignRegisSMSStats } from "./loader/campaignRegisSMSStats.loader";

const Query = {
  getAllCampaignSocialResult: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN, ROLES.EDITOR]);
    return campaignSocialResultService.fetch(args.q);
  },
  getOneCampaignSocialResult: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN, ROLES.EDITOR]);
    const { id } = args;
    return await campaignSocialResultService.findOne({ _id: id });
  },
};

const Mutation = {
  updateMessageReceivingStatus: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { id, data } = args;
    const { messageReceivingStatus } = data;

    const { SENT, NOTYET, ERROR } = MessageReceivingStatus;
    const statusList = [SENT, NOTYET, ERROR]

    if (!messageReceivingStatus
      || statusList.findIndex(s => s === messageReceivingStatus) === -1
    )
      throw ErrorHelper.requestDataInvalid('Tình trạng gửi messenger');
    return await campaignSocialResultService.updateOne(id, data);
  },
};

const CampaignSocialResult = {
  member: GraphQLHelper.loadById(MemberLoader, "memberId"),
  campaign: GraphQLHelper.loadById(CampaignLoader, "campaignId"),
  orderItems: GraphQLHelper.loadManyById(OrderItemLoader, "orderItemIds"),
  regisSMSs: GraphQLHelper.loadManyById(RegisSMSLoader, "regisSMSIds"),
  regisServices: GraphQLHelper.loadManyById(RegisSMSLoader, "regisServiceIds"),
  orderStats: async (root: ICampaignSocialResult, args: any, context: Context) => {
    return CampaignOrderStats.getLoader(root.id).load(root.id);
  },
  smsStats: async (root: ICampaignSocialResult, args: any, context: Context) => {
    return CampaignRegisSMSStats.getLoader(root.id).load(root.id);
  },
  serviceStats: async (root: ICampaignSocialResult, args: any, context: Context) => {
    return CampaignRegisServiceStats.getLoader(root.id).load(root.id);
  }
};

export default {
  Query,
  Mutation,
  CampaignSocialResult,
};
