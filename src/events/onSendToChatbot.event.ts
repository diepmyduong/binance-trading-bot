import { Subject } from "rxjs";
import { SettingKey } from "../configs/settingData";
import { IChatBotImageMessage, IChatBotTextMessage } from "../graphql/modules/chatBot/chatBot.model";
import { SettingHelper } from "../graphql/modules/setting/setting.helper";

import { ChatBotHelper } from "../helpers/chatbot.helper";

export const onSendChatBotText = new Subject<IChatBotTextMessage>();

// Tự động gửi tin nhắn đến số điện thoại có subcribe fanpage
onSendChatBotText.subscribe(async ({ apiKey, psids, message, context }) => {
  if (!psids || psids.length == 0) return;
  apiKey = apiKey || (await SettingHelper.load(SettingKey.CHATBOT_API_KEY));
  new ChatBotHelper(apiKey).sendTextMessage(psids, message, context);
});