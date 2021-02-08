import { gql } from "apollo-server-express";
import { ChatbotStoryType } from "./chatbotStory.type";
export default gql`
    type ChatbotStory {
        "Mã trang"
        pageId: String
        "Mã câu chuyện"
        storyId: String
        "Tên câu chuyện"
        name: String
        "Câu chuyện bắt đầu"
        isStarted: Boolean
        "Sử dụng đường dẫn"
        isUseRef: Boolean
        "Từ khoá đường dẫn"
        ref: String
        "Tin nhắn"
        message: String
        "Tiêu đề nút"
        btnTitle: String
        "Loại kịch bản ${Object.values(ChatbotStoryType)}"
        type: String
        "Hình ảnh"
        image: String
    }
    input ChatbotStoryInput {
        name: String
        ref: String
        message: String
        btnTitle: String
        type: String!
        image: String
    }
`;
