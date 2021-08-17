import mongoose from "mongoose";
import { MainConnection } from "../../../helpers/mongo";
import { BaseDocument, ModelLoader } from "../../../base/model";
const Schema = mongoose.Schema;

export type IAddress = BaseDocument & {
  province?: string;
  provinceId?: string;
  district?: string;
  districtId?: string;
  ward?: string;
  wardId?: string;
};

const addressSchema = new Schema(
  {
    province: { type: String },
    provinceId: { type: String },
    district: { type: String },
    districtId: { type: String },
    ward: { type: String },
    wardId: { type: String },
  },
  { timestamps: true, collation: { locale: "vi" } }
);

addressSchema.index({ province: "text", district: "text", ward: "text" }, {
  weights: { province: 2, district: 2, ward: 2 },
} as any);

export const AddressModel = MainConnection.model<IAddress>("Address", addressSchema);

export const AddressLoader = ModelLoader<IAddress>(AddressModel);
