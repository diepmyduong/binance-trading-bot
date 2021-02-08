import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;

export type IEVoucherItem = BaseDocument & {
  code?: string;
  eVoucherId?: string;
  activated: Boolean;
};

const eVoucherItemSchema = new Schema(
  {
    code: { type: String, required: true },
    eVoucherId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "EVoucher"
    },
    activated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

eVoucherItemSchema.index({ code: "text" }, { weights: { code: 2 } });

export const EVoucherItemHook = new ModelHook<IEVoucherItem>(eVoucherItemSchema);
export const EVoucherItemModel: mongoose.Model<IEVoucherItem> = MainConnection.model(
  "EVoucherItem",
  eVoucherItemSchema
);

export const EVoucherItemLoader = ModelLoader<IEVoucherItem>(EVoucherItemModel, EVoucherItemHook);
