import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
import { ProductType } from "../product/product.model";
import { MemberType } from "../member/member.model";
const Schema = mongoose.Schema;

export enum CampaignStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",

}

export type ICampaign = BaseDocument & {
  code: string;
  name?: string;
  title: string;
  content: string;
  hashtags: string[];
  image: string;
  startDate: Date;// ngày bắt đầu
  endDate: Date;// ngày kết thúc
  memberType?: MemberType;
  memberIds: string[], // danh sách chủ shop id được áp dụng
  campainSocialResultIds: string[],
  provinceId: string;
  province: string;
  branchId: string;
  productId: string;
  memberId: string;
  status?: CampaignStatus; // trạng thái chiến dịch
};

const campaignSchema = new Schema(
  {
    code: { type: String, unique: true, required: true }, // code chiến dịch
    name: { type: String, required: true }, // tên chiến dịch
    title: { type: String }, // tiêu đề chiến dịch
    content: { type: String }, // bản tin chiến dịch
    hashtags: { type: Array }, // hashtags
    image: { type: String }, // hình ảnh chiến dịch
    startDate: { type: Date, required: true }, // ngày bắt đầu
    endDate: { type: Date, required: true }, // ngày kết thúc

    // áp dụng cho member nào
    memberType: { type: String, required: true, enum: Object.values(MemberType), default: MemberType.AGENCY },
    provinceId: { type: String },// vùng miền được áp dụng  - PROVINCE
    province: { type: String },
    branchId: { type: Schema.Types.ObjectId, ref: "Branch" }, // chi nhánh được áp dụng -  BRANCH
    memberIds: {
      type: [{ type: Schema.Types.ObjectId, ref: "Member" }],
      minlength: 1,
    }, // danh sách chủ shop id được áp dụng
    campainSocialResultIds: {
      type: [{ type: Schema.Types.ObjectId, ref: "CampainSocialResult" }],
      minlength: 1,
    },
    // chọn chiến dịch cho sản phẩm ?
    productId: { type: Schema.Types.ObjectId, ref: "Product" }, // san pham nay cua mobifone hay ko ?
    status: { type: String, enum: Object.values(CampaignStatus), default: CampaignStatus.OPEN }, // trạng thái chiến dịch
  },
  { timestamps: true }
);

// campaignSchema.index({ name: "text" }, { weights: { name: 2 } });

export const CampaignHook = new ModelHook<ICampaign>(campaignSchema);
export const CampaignModel: mongoose.Model<ICampaign> = MainConnection.model(
  "Campaign",
  campaignSchema
);

export const CampaignLoader = ModelLoader<ICampaign>(CampaignModel, CampaignHook);
