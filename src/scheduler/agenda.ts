import AgendaClient from "agenda";
import mongoose, { Schema } from "mongoose";
import { BaseDocument, ModelLoader } from "../base/model";

import config from "config";
import { MainConnection } from "../helpers/mongo";

const agenda = new AgendaClient({
  db: { address: config.get("mongo.main"), collection: "agendaJobs" },
});

export const Agenda = agenda;

export type IAgendaJob = BaseDocument & {
  name?: string; // Tên job
  data?: any; // Dữ liệu kèm theo
  type?: string; // Loại job
  priority?: number; // Độ ưu tiên
  nextRunAt?: Date; // Lần chạy tiếp theo
  lastModifiedBy?: null; // Người câp nhật
  lockedAt?: Date; // Ngày khoá
  lastRunAt?: Date; // Ngày chạy lần cuối
  lastFinishedAt?: Date; // Kết thúc gần nhất
  disabled?: boolean; // Tắt job
};

const agendaJobSchema = new Schema(
  {
    name: { type: String },
    data: { type: Schema.Types.Mixed },
    type: { type: String },
    priority: { type: String },
    nextRunAt: { type: String },
    lastModifiedBy: { type: String },
    lockedAt: { type: String },
    lastRunAt: { type: String },
    lastFinishedAt: { type: String },
    disabled: { type: Boolean },
  },
  { timestamps: true }
);

export const AgendaJobModel = MainConnection.model<IAgendaJob>(
  "AgendaJob",
  agendaJobSchema,
  "agendaJobs"
);

export const AgendaJobLoader = ModelLoader<IAgendaJob>(AgendaJobModel);
