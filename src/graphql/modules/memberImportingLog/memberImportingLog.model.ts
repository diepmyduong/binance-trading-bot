import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;

export type IMemberImportingLog = BaseDocument & {
  no: string;
  branchCode: string;
  branch: string;
  code: string;
  shopName: string;
  email: string;
  name: string;
  birthday: Date;
  phone: string;
  identityCardNumber: string;
  gender: string;
  gioiTinh: string;
  address: string;
  province: string;
  district: string;
  ward: string;
  provinceId: string;
  districtId: string;
  wardId: string;
  status: string;
  success: Boolean;
  error: string;
};

const memberImportingLogSchema = new Schema(
  {
    no: { type: String },
    branchCode: { type: String },
    branch: { type: String },
    code: { type: String },
    shopName: { type: String },
    email: { type: String },
    name: { type: String },
    birthday: { type: Date },
    phone: { type: String },
    identityCardNumber: { type: String },
    gender: { type: String },
    gioiTinh: { type: String },
    address: { type: String },
    province: { type: String },
    district: { type: String },
    ward: { type: String },
    provinceId: { type: String },
    districtId: { type: String },
    wardId: { type: String },
    status: { type: String },
    line: { type: Number },
    success: { type: Boolean },
    error: { type: String },
  },
  { timestamps: true }
);

// memberImportingLogSchema.index({ name: "text" }, { weights: { name: 2 } });

export const MemberImportingLogHook = new ModelHook<IMemberImportingLog>(
  memberImportingLogSchema
);
export const MemberImportingLogModel: mongoose.Model<IMemberImportingLog> = MainConnection.model(
  "MemberImportingLog",
  memberImportingLogSchema
);

export const MemberImportingLogLoader = ModelLoader<IMemberImportingLog>(
  MemberImportingLogModel,
  MemberImportingLogHook
);
