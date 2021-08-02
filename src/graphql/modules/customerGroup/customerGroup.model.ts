import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;

export type ICustomerGroup = BaseDocument & {
  memberId?: string; // Mã chủ shop
  name?: string; // Tên nhóm
  filter?: any; // Bộ lọc
  summary?: number; // Tổng số KH
};

const customerGroupSchema = new Schema(
  {
    memberId: { type: Schema.Types.ObjectId, ref: "Member", required: true },
    name: { type: String, required: true },
    filter: { type: Schema.Types.Mixed },
    summary: { type: Number, default: 0 },
  },
  { timestamps: true }
);

customerGroupSchema.index({ name: "text" }, { weights: { name: 2 } });

export const CustomerGroupHook = new ModelHook<ICustomerGroup>(customerGroupSchema);
export const CustomerGroupModel: mongoose.Model<ICustomerGroup> = MainConnection.model(
  "CustomerGroup",
  customerGroupSchema
);

export const CustomerGroupLoader = ModelLoader<ICustomerGroup>(
  CustomerGroupModel,
  CustomerGroupHook
);
