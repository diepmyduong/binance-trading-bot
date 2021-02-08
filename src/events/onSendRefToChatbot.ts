import { Subject } from "rxjs";
import { SettingKey } from "../configs/settingData";
import { SettingHelper } from "../graphql/modules/setting/setting.helper";

import { ChatBotHelper } from "../helpers/chatbot.helper";

export type IChatBotRefPayload = {
  apiKey?: string;
  psids: string[];
  ref: string;
  context: any;
};
export const onSendRefToChatbot = new Subject<IChatBotRefPayload>();

// Tự động gửi tin nhắn đến số điện thoại có subcribe fanpage
onSendRefToChatbot.subscribe(async ({ apiKey, psids, ref, context }) => {
  apiKey = apiKey || (await SettingHelper.load(SettingKey.CHATBOT_API_KEY));
  new ChatBotHelper(apiKey).sendStoryByRef(psids, ref, context);
});
