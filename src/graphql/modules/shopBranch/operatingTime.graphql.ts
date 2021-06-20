import { gql } from "apollo-server-express";
import { Schema } from "mongoose";
import { Context } from "../../context";

export default {
  schema: gql`
    extend type ShopBranch {
      operatingTimes: [OperatingTime]
    }
    type OperatingTime {
      "Ngày trong tuần"
      day: Int
      "Khung thời gian"
      timeFrames: [[String]]
      "Có mở cửa"
      isOpen: boolean; // 
    }
  `,
  resolver: {},
};

export type OperatingTime = {
  day?: number; // Ngày trong tuần
  timeFrames?: string[][]; // Khung thời gian
  isOpen?: boolean; // Có mở cửa
};

export const OperatingTimeSchema = new Schema({
  day: { type: Number, min: 1, max: 7, required: true },
  timeFrames: { type: [{ type: [String] }] },
  isOpen: { type: Boolean, default: true },
});
