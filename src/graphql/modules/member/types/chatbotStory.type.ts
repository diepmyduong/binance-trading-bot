import { Schema } from "mongoose";
export enum ChatbotStoryType {
  TEXT = "TEXT",
  GENERIC = "GENERIC",
}
export type ChatbotStory = {
  pageId?: string; // Mã trang
  storyId?: string; // Mã câu chuyện
  name?: string; // Tên câu chuyện
  isStarted?: boolean; // Câu chuyện bắt đầu
  isUseRef?: boolean; // Sử dụng đường dẫn
  ref?: string; // Từ khoá đường dẫn
  message?: string; // Tin nhắn
  btnTitle?: string; // Tiêu đề nút
  image?: string; // Hình ảnh
  type?: ChatbotStoryType; // Loại kịch bản
  webappDomain?: string; // Tên miền webapp
};

export const ChatbotStorySchema = new Schema({
  pageId: { type: Schema.Types.ObjectId, required: true },
  storyId: { type: Schema.Types.ObjectId, required: true },
  name: { type: String },
  isStarted: { type: Boolean },
  isUseRef: { type: Boolean },
  ref: { type: String },
  message: { type: String },
  image: { type: String },
  btnTitle: { type: String },
  type: { type: String, enum: Object.values(ChatbotStoryType), default: ChatbotStoryType.TEXT },
  webappDomain: { type: String },
});
