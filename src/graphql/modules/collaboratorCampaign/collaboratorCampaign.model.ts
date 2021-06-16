import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;

export type ICollaboratorCampaign = BaseDocument & {
  code?: string; // Mã chiến dịch
  name?: string; // Tên chi ến dịch
  title?: string; // Tiêu đề
  content?: string; // Nội dung
  hashtags?: string[]; // Hash Tags
  image?: string; // Hình ảnh
  startDate?: Date; // Ngày bắt đầu
  endDate?: Date; // Ngày kết thúc
  memberIds?: string[]; // Danh sách chủ shop id được áp dụng
  branchId?: string; // Chi nhánh áp dụng
  productId?: string; // Sản phẩm áp dụng chiến dịch
  isPublish?: boolean; // Trạng thái đăng
  point?: number; // Điểm ghi nhận
};

const collaboratorCampaignSchema = new Schema(
  {
    code: { type: String, required: true },
    name: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    hashtags: { type: [String], default: [] },
    image: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    memberIds: { type: [{ type: Schema.Types.ObjectId, ref: "Member" }], default: [] },
    branchId: { type: Schema.Types.ObjectId, ref: "Branch" },
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    isPublish: { type: Boolean, default: false },
    point: { type: Number, default: 0 },
  },
  { timestamps: true }
);

collaboratorCampaignSchema.index({ code: 1 }, { unique: true });
collaboratorCampaignSchema.index({ name: "text", code: "text" }, { weights: { name: 2, code: 2 } });

export const CollaboratorCampaignHook = new ModelHook<ICollaboratorCampaign>(
  collaboratorCampaignSchema
);
export const CollaboratorCampaignModel: mongoose.Model<ICollaboratorCampaign> = MainConnection.model(
  "CollaboratorCampaign",
  collaboratorCampaignSchema
);

export const CollaboratorCampaignLoader = ModelLoader<ICollaboratorCampaign>(
  CollaboratorCampaignModel,
  CollaboratorCampaignHook
);
