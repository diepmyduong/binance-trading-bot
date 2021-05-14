import DataLoader from "dataloader";
import { keyBy, times } from "lodash";

import { SettingKey } from "../../../../configs/settingData";
import { ChatBotHelper } from "../../../../helpers/chatbot.helper";
import { SettingHelper } from "../../setting/setting.helper";
import { SubscriberInfo } from "../types/subscriberInfo.type";

export class MemberSubscriber {
  static loaders: { [x: string]: DataLoader<string, SubscriberInfo> } = {};
  static getLoader(apiKey: string) {
    if (!this.loaders[apiKey]) {
      this.loaders[apiKey] = new DataLoader<string, SubscriberInfo>(
        async (ids: string[]) => {
          const chatbotHelper = new ChatBotHelper(apiKey);
          return await chatbotHelper
            .getAllSubscribers(ids)
            .then((list) => {
              const listKeyBy = keyBy(list, "psid");
              return ids.map((id) => listKeyBy[id]);
            })
            .catch((err) => times(ids.length, null));
        },
        { cache: true } // Bỏ cache
      );
    }
    return this.loaders[apiKey];
  }
}
