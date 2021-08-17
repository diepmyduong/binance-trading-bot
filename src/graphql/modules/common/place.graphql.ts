import { gql } from "apollo-server-express";
import { Schema } from "mongoose";

export const LocationSchema = new Schema({
  type: { type: Schema.Types.String, default: "Point" },
  coordinates: {
    type: [{ type: Schema.Types.Number, default: 0 }],
    minlength: 2,
    maxlength: 2,
  },
});

export type Place = {
  street?: string; // Tên đường
  province?: string; // Tỉnh / thành
  provinceId?: string; // Mã Tỉnh / thành
  district?: string; // Quận / huyện
  districtId?: string; // Mã quận / huyện
  ward?: string; // Phường / xã
  wardId?: string; // Mã phường / xã
  fullAddress?: string; // Địa chỉ đầy đủ
  location?: any; // Toạ độ
  note?: string; // Ghi chú
};

export const PlaceSchema = new Schema({
  street: { type: String },
  province: { type: String },
  provinceId: { type: String },
  district: { type: String },
  districtId: { type: String },
  ward: { type: String },
  wardId: { type: String },
  fullAddress: { type: String },
  location: { type: LocationSchema },
  note: { type: String },
});

PlaceSchema.index({ location: "2dsphere" });

export default {
  schema: gql`
    type Place {
      "Tên đường"
      street: String
      "Tỉnh / thành"
      province: String
      "Mã Tỉnh / thành"
      provinceId: String
      "Quận / huyện"
      district: String
      "Mã quận / huyện"
      districtId: String
      "Phường / xã"
      ward: String
      "Mã phường / xã"
      wardId: String
      "Địa chỉ đầy đủ"
      fullAddress: String
      "Toạ độ"
      location: Mixed
      "Ghi chú"
      note: String
    }
    input PlaceInput {
      "Tên đường"
      street: String
      "Tỉnh / thành"
      province: String
      "Mã Tỉnh / thành"
      provinceId: String
      "Quận / huyện"
      district: String
      "Mã quận / huyện"
      districtId: String
      "Phường / xã"
      ward: String
      "Mã phường / xã"
      wardId: String
      "Địa chỉ đầy đủ"
      fullAddress: String
      "Toạ độ"
      location: Mixed
      "Ghi chú"
      note: String
    }
  `,
  resolver: {},
};
