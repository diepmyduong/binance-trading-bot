import mongoose from "mongoose";

import { BaseDocument } from "../../base/model";
import { MainConnection } from "../../helpers/mongo";

const Schema = mongoose.Schema;

export type ICounter = BaseDocument & {
  name?: string;
  value?: number;
};

const counterSchema = new Schema(
  {
    name: { type: String, required: true },
    value: { type: Number, default: 0 },
  },
  { timestamps: true }
);

counterSchema.index({ name: 1 }, { unique: true });
counterSchema.index({ name: "text" }, { weights: { name: 2 } } as any);

export const CounterModel = MainConnection.model<ICounter>("Counter", counterSchema);
