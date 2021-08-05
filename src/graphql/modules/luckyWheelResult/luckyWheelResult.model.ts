import mongoose from "mongoose";

import { BaseDocument, ModelHook, ModelLoader } from "../../../base/baseModel";
import { MainConnection } from "../../../loaders/database";
import { Gift, GiftSchema } from "../luckyWheel/gift.graphql";

const Schema = mongoose.Schema;

export type ILuckyWheelResult = BaseDocument & {
  memberId?: string; // Mã chủ shop
  customerId?: string; //mã khách hàng
  luckyWheelId?: string; //mã vòng quay
  code?: string; // Mã quà
  gift?: Gift; // Quà
};

const luckyWheelResultSchema = new Schema(
  {
    memberId: { type: Schema.Types.ObjectId, ref: "Member", required: true },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    luckyWheelId: { type: Schema.Types.ObjectId, ref: "LuckyWheel", required: true },
    code: { type: String, required: true },
    gift: { type: GiftSchema, required: true },
  },
  { timestamps: true }
);

luckyWheelResultSchema.index({ memberId: 1, luckyWheelId: 1, customerId: 1 });
luckyWheelResultSchema.index({ luckyWheelId: 1, "gift._id": 1 });

export const LuckyWheelResultHook = new ModelHook<ILuckyWheelResult>(luckyWheelResultSchema);
export const LuckyWheelResultModel: mongoose.Model<ILuckyWheelResult> = MainConnection.model(
  "LuckyWheelResult",
  luckyWheelResultSchema
);

export const LuckyWheelResultLoader = ModelLoader<ILuckyWheelResult>(
  LuckyWheelResultModel,
  LuckyWheelResultHook
);
