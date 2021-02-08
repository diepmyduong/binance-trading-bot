import AgendaClient from "agenda";
import mongoose, { Schema } from "mongoose";
import { BaseDocument, ModelLoader } from "../base/baseModel";

import { configs } from "../configs";
import { MainConnection } from "../loaders/database";

const agenda = new AgendaClient({ db: { address: configs.maindb, collection: "agendaJobs" } });

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

export const AgendaJobModel: mongoose.Model<IAgendaJob> = MainConnection.model(
  "AgendaJob",
  agendaJobSchema,
  "agendaJobs"
);

export const AgendaJobLoader = ModelLoader<IAgendaJob>(AgendaJobModel);
