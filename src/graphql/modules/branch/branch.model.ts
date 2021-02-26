import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;

export type IBranch = BaseDocument & {
  code: string; // Code chi nhánh
  name?: string; // Tên chi nhánh
};

const branchSchema = new Schema(
  {
    code: { type: String },
    name: { type: String, required: true },
  },
  { timestamps: true }
);

branchSchema.index({ name: "text" }, { weights: { name: 2 } });

export const BranchHook = new ModelHook<IBranch>(branchSchema);
export const BranchModel: mongoose.Model<IBranch> = MainConnection.model("Branch", branchSchema);

export const BranchLoader = ModelLoader<IBranch>(BranchModel, BranchHook);
