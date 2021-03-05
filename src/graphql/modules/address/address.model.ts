import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
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

addressSchema.index({ province: "text" , district: "text", ward: "text" }, { weights: { province: 2, district:2, ward:2 } });

export const AddressHook = new ModelHook<IAddress>(addressSchema);
export const AddressModel: mongoose.Model<IAddress> = MainConnection.model(
  "Address",
  addressSchema
);

export const AddressLoader = ModelLoader<IAddress>(AddressModel, AddressHook);
