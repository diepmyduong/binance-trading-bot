import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;

export type IPosition = BaseDocument & {
  name?: string;
};

const positionSchema = new Schema(
  {
    name: { type: String },
  },
  { timestamps: true }
);

// positionSchema.index({ name: "text" }, { weights: { name: 2 } });

export const PositionHook = new ModelHook<IPosition>(positionSchema);
export const PositionModel: mongoose.Model<IPosition> = MainConnection.model(
  "Position",
  positionSchema
);

export const PositionLoader = ModelLoader<IPosition>(PositionModel, PositionHook);
