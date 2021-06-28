import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;

export enum ShopCommentStatus {
  PENDING = "PENDING", // Đang chờ
  PUBLIC = "PUBLIC", // Công khai
  HIDDEN = "HIDDEN", // Ẩn
}
export type IShopComment = BaseDocument & {
  memberId?: string; // Mã chủ shop
  customerId?: string; // Mã khách hàng
  orderId?: string; // Mã đơn hàng
  ownerName?: string; // Tên người comment
  message?: string; // Nội dung bình luận
  rating?: number; // Điểm đánh giá
  status?: ShopCommentStatus; // Trạng thái bình luận
};

const shopCommentSchema = new Schema(
  {
    memberId: { type: Schema.Types.ObjectId, ref: "Member", required: true },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer" },
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
    ownerName: { type: String, required: true },
    message: { type: String, required: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    status: {
      type: String,
      enum: Object.values(ShopCommentStatus),
      default: ShopCommentStatus.PENDING,
    },
  },
  { timestamps: true }
);

shopCommentSchema.index({ memberId: 1 });
shopCommentSchema.index({ ownerName: "text" }, { weights: { ownerName: 2 } });

export const ShopCommentHook = new ModelHook<IShopComment>(shopCommentSchema);
export const ShopCommentModel: mongoose.Model<IShopComment> = MainConnection.model(
  "ShopComment",
  shopCommentSchema
);

export const ShopCommentLoader = ModelLoader<IShopComment>(ShopCommentModel, ShopCommentHook);
