import DataLoader from "dataloader";
import { keyBy, times } from "lodash";

import { SettingKey } from "../../../../configs/settingData";
import { ChatBotHelper } from "../../../../helpers/chatbot.helper";
import { SubscriberInfo } from "../../member/types/subscriberInfo.type";
import { SettingHelper } from "../../setting/setting.helper";

export class UserSubscriber {
  static loader = new DataLoader<string, SubscriberInfo>(
    async (ids: string[]) => {
      const apiKey = await SettingHelper.load(SettingKey.CHATBOT_API_KEY);
      const chatbotHelper = new ChatBotHelper(apiKey);
      return await chatbotHelper
        .getAllSubscribers(ids)
        .then((list) => {
          const listKeyBy = keyBy(list, "psid");
          return ids.map((id) => listKeyBy[id]);
        })
        .catch((error) => times(ids.length, (i) => null));
    },
    { cache: true } // Bỏ cache
  );
}
