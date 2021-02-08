import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;

export type IEVoucher = BaseDocument & {
  code?: string;
  name?: string;
  desc: string;
};

const eVoucherSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    }, // tên voucher
    desc: { type: String }, // thông tin voucher
  },
  { timestamps: true }
);

eVoucherSchema.index(
  { name: "text", code: "text" },
  { weights: { name: 2, code: 1 } }
);

export const EVoucherHook = new ModelHook<IEVoucher>(eVoucherSchema);
export const EVoucherModel: mongoose.Model<IEVoucher> = MainConnection.model(
  "EVoucher",
  eVoucherSchema
);

export const EVoucherLoader = ModelLoader<IEVoucher>(
  EVoucherModel,
  EVoucherHook
);
