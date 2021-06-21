import { gql } from "apollo-server-express";
import { Schema } from "mongoose";
import { Context } from "../../context";
export enum OperatingTimeStatus {
  OPEN = "OPEN", // Mở cửa 24/24
  CLOSED = "CLOSED", // Đóng cửa
  TIME_FRAME = "TIME_FRAME", // Theo khung giờ
}
export type OperatingTime = {
  day?: number; // Ngày trong tuần
  timeFrames?: string[][]; // Khung thời gian
  status?: OperatingTimeStatus; // Trạng thái hoạt động
};

export const OperatingTimeSchema = new Schema({
  day: { type: Number, min: 1, max: 7, required: true },
  timeFrames: { type: [{ type: [String] }] },
  status: {
    type: String,
    enum: Object.values(OperatingTimeStatus),
    default: OperatingTimeStatus.OPEN,
  },
});
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
      "Trạng thái hoạt động ${Object.values(OperatingTimeStatus)}"
      status: String
    }
  `,
  resolver: {},
};
