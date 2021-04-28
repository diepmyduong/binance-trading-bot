import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;

export enum MessageReceivingStatus {
  SENT = "SENT",
  NOTYET = "NOTYET",
  PENDING = "PENDING",
  ERROR = "ERROR"
}

export type ICampaignSocialResult = BaseDocument & {
  affiliateLink?: string;
  shortUrl: string;
  campaignId?: string;
  memberId?: string;
  productId?: string;
  likeCount: number;
  shareCount: number;
  commentCount: number;
  synced: Boolean;
  orderItemIds: string[];
  regisSMSIds: string[];
  regisServiceIds: string[];
  messageReceivingStatus: MessageReceivingStatus
  messageReceivingError: string
};

const campaignSocialResultSchema = new Schema(
  {
    affiliateLink: { type: String },
    shortUrl: { type: String },
    likeCount: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    campaignId: { type: Schema.Types.ObjectId, ref: "Campaign" },
    memberId: { type: Schema.Types.ObjectId, ref: "Member" },
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    orderItemIds: {
      type: [{ type: Schema.Types.ObjectId, ref: "OrderItem" }]
    },
    regisSMSIds: {
      type: [{ type: Schema.Types.ObjectId, ref: "RegisSMS" }]
    },
    regisServiceIds: {
      type: [{ type: Schema.Types.ObjectId, ref: "RegisService" }]
    },
    messageReceivingStatus: { type: String, default: MessageReceivingStatus.NOTYET },
    messageReceivingError: { type: String }
  },
  { timestamps: true }
);

// campaignSocialResultSchema.index({ name: "text" }, { weights: { name: 2 } });

export const CampaignSocialResultHook = new ModelHook<ICampaignSocialResult>(campaignSocialResultSchema);
export const CampaignSocialResultModel: mongoose.Model<ICampaignSocialResult> = MainConnection.model(
  "CampaignSocialResult",
  campaignSocialResultSchema
);

export const CampaignSocialResultLoader = ModelLoader<ICampaignSocialResult>(CampaignSocialResultModel, CampaignSocialResultHook);
