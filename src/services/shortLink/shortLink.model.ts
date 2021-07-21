import mongoose from "mongoose";
import { BaseDocument } from "../../base/baseModel";
import { MainConnection } from "../../loaders/database";
const Schema = mongoose.Schema;

export type IShortLink = BaseDocument & {
  code?: string;
  url?: string;
  expiredAt?: Date;
  click?: number;
};

const shortLinkSchema = new Schema(
  {
    code: { type: String, required: true },
    url: { type: String, required: true },
    expiredAt: { type: Date, required: true },
    click: { type: Number, default: 0 },
  },
  { timestamps: true }
);

shortLinkSchema.index({ code: 1 }, { unique: true });

export const ShortLinkModel: mongoose.Model<IShortLink> = MainConnection.model(
  "ShortLink",
  shortLinkSchema
);
