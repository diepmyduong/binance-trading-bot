import { CrudService } from "../../../base/crudService";
import { SettingKey } from "../../../configs/settingData";
import { ErrorHelper } from "../../../helpers";
import { ChatBotHelper } from "../../../helpers/chatbot.helper";
import { SettingHelper } from "../setting/setting.helper";
import { IChatBotImageMessage, IChatBotTextMessage } from "./chatBot.model";
class ChatBotService {
  sendChatBotMessage = async ({ apiKey, psids, message, context }: IChatBotTextMessage) => {
    if (!psids || psids.length == 0) return { success: false, error: ErrorHelper.psIdNotfound() };
    apiKey = apiKey || (await SettingHelper.load(SettingKey.CHATBOT_API_KEY));
    const result: any = await new ChatBotHelper(apiKey).sendTextMessage(psids, message, context);
    if (!result.data) {
      return { success: false, error: ErrorHelper.chatBotMessageError() };
    }
    return { success: true, data: result.data };
  }

  sendChatBotImage = async ({ apiKey, psids, image, context }: IChatBotImageMessage) => {
    if (!psids || psids.length == 0) return { success: false, error: ErrorHelper.psIdNotfound() };
    apiKey = apiKey || (await SettingHelper.load(SettingKey.CHATBOT_API_KEY));
    const result: any = await new ChatBotHelper(apiKey).sendImageMessage(psids, image, context);
    if (!result.data) {
      return { success: false, error: ErrorHelper.chatBotImageError() };
    }
    return { success: true, data: result.data };
  }
}

const chatBotService = new ChatBotService();

export { chatBotService };


// Tự động gửi tin nhắn đến số điện thoại có subcribe fanpage
;




