import Axios from "axios";
import { get } from "lodash";
import NodeCache from "node-cache";

import { ErrorHelper } from "../base/error";
import { configs } from "../configs";
import { SubscriberInfo } from "../graphql/modules/member/types/subscriberInfo.type";

const host = `${configs.chatbot.host}/api/v1`;
const cacheTTL: number = 60 * 60 * 24; // 1 Ngày
const cache = new NodeCache({ stdTTL: cacheTTL });
export class ChatBotHelper {
  public token: string;

  constructor(public apiKey: string) {
    const [type, id, token] = apiKey.split("|");
    this.token = token;
  }
  static async decodeSignedRequest(signedRequest: string) {
    if (cache.get(signedRequest)) return cache.get<MessengerTokenDecoded>(signedRequest);
    return Axios.post(
      `${host}/app/messengerSignDecode`,
      { signedRequest },
      { headers: { "Content-Type": "application/json" } }
    )
      .then((res) => {
        const tokenData = get(res.data, "results.object");
        if (!tokenData) throw ErrorHelper.badToken();
        const decoded = {
          pageId: tokenData.page_id,
          psid: tokenData.psid,
          threadId: tokenData.tid,
        } as MessengerTokenDecoded;
        cache.set<MessengerTokenDecoded>(signedRequest, decoded);
        return decoded;
      })
      .catch((err) => {
        throw ErrorHelper.badToken();
      });
  }
  async sendTextMessage(psids: string[], message: string, context?: any) {
    return Axios.post(
      `${host}/send`,
      {
        type: "new_story",
        story: [{ type: "text", option: { text: message } }],
        sendBy: "psid",
        sendTo: psids,
        nonTask: true,
        context: context,
      },
      { headers: { "Content-Type": "application/json", "x-api-key": this.apiKey } }
    ).catch((err: any) => console.log("Gửi tin nhắn lỗi ", err.message));
  }

  async sendImageMessage(psids: string[], image: string, context?: any) {
    return Axios.post(
      `${host}/send`,
      {
        type: "new_story",
        story: [
          {
            type: "image",
            option: {
              attachment: {
                type: "image",
                payload: {
                  url: image,
                },
              },
            },
          },
        ],
        sendBy: "psid",
        sendTo: psids,
        nonTask: true,
        context: context,
      },
      { headers: { "Content-Type": "application/json", "x-api-key": this.apiKey } }
    ).catch((err: any) => console.log("Gửi tin nhắn lỗi ", err.message));
  }
  async sendStoryByRef(psids: string[], ref: string, context: any) {
    return Axios.post(
      `${host}/send`,
      {
        type: "ref",
        story: ref,
        sendBy: "psid",
        sendTo: psids,
        context: context,
        nonTask: true,
      },
      { headers: { "Content-Type": "application/json", "x-api-key": this.apiKey } }
    ).catch((err: any) => console.log("Gửi tin nhắn lỗi ", err.message, ref));
  }
  async getPageInfo() {
    console.log("this.apiKey", this.apiKey);
    return Axios.get(`${host}/page`, {
      params: { fields: ["$all"] },
      headers: { "Content-Type": "application/json", "x-api-key": this.apiKey },
    }).then((res) => {
      const pageData = get(res.data, "results.objects.rows.0");
      if (!pageData) throw ErrorHelper.requestDataInvalid("Api Key Không hợp lệ");
      return {
        id: pageData._id,
        appId: pageData.app,
        pageId: get(pageData, "meta.id"),
        pageName: get(pageData, "meta.name"),
        picture: get(pageData, "meta.picture.data.url"),
      } as PageInfo;
    });
  }
  async getSubscriber(psid: string) {
    return Axios.get(`${host}/subscriber`, {
      params: { fields: ["messengerProfile", "_id"], filter: JSON.stringify({ psid }) },
      headers: { "Content-Type": "application/json", "x-api-key": this.apiKey },
    }).then((res) => {
      const subscriber = get(res.data, "results.objects.rows.0");
      if (!subscriber) throw ErrorHelper.requestDataInvalid("Api Key Không hợp lệ");
      return this.parse(subscriber);
    });
  }
  async searchSubscriber(query: string) {
    return Axios.get(`${host}/subscriber`, {
      params: { fields: ["messengerProfile", "_id"], search: query },
      headers: { "Content-Type": "application/json", "x-api-key": this.apiKey },
    }).then((res) => {
      const subscribers = get(res.data, "results.objects.rows");
      if (!subscribers) throw ErrorHelper.requestDataInvalid("Api Key Không hợp lệ");
      return subscribers.map((s: any) => this.parse(s));
    });
  }
  async getAllSubscribers(psids: string[]) {
    return Axios.get(`${host}/subscriber`, {
      params: {
        fields: ["messengerProfile", "_id"],
        filter: JSON.stringify({ psid: { $in: psids } }),
      },
      headers: { "Content-Type": "application/json", "x-api-key": this.apiKey },
    }).then((res) => {
      const subscribers = get(res.data, "results.objects.rows");
      if (!subscribers) throw ErrorHelper.requestDataInvalid("Api Key Không hợp lệ");
      return subscribers.map((s: any) => this.parse(s)) as SubscriberInfo[];
    });
  }
  private parse(raw: any) {
    return {
      id: raw._id,
      psid: raw.messengerProfile.id,
      name: raw.messengerProfile.name,
      firstName: raw.messengerProfile.first_name,
      lastName: raw.messengerProfile.last_name,
      gender: raw.messengerProfile.gender,
      locale: raw.messengerProfile.locale,
      profilePic: raw.messengerProfile.profile_pic,
    } as SubscriberInfo;
  }
  async createStory(pageId: string, name: string) {
    return Axios.post(
      `${host}/page/${pageId}/stories`,
      {
        name: name,
        type: "custom",
        mode: "normal",
      },
      {
        headers: { "Content-Type": "application/json", "x-api-key": this.apiKey },
      }
    ).then((res) => {
      return get(res.data, "results.object") as StoryInfo;
    });
  }
  async setGetStartedStories(pageId: string, storyId: string) {
    return Axios.put(
      `${host}/page/${pageId}/setGetStartedStories`,
      { storyIds: [storyId] },
      {
        headers: { "Content-Type": "application/json", "x-api-key": this.apiKey },
      }
    );
  }
  async updateStory(storyId: string, story: any) {
    return Axios.put(`${host}/story/${storyId}`, story, {
      headers: { "Content-Type": "application/json", "x-api-key": this.apiKey },
    }).then((res) => {
      return get(res.data, "results.object") as StoryInfo;
    });
  }
  async addCard(storyId: string, card: any) {
    return Axios.post(`${host}/story/${storyId}/cards`, card, {
      headers: { "Content-Type": "application/json", "x-api-key": this.apiKey },
    }).then((res) => {
      return get(res.data, "results.object");
    });
  }
  async getWhitelistSetting(pageId: string) {
    return Axios.get(`${host}/setting`, {
      params: {
        filter: JSON.stringify({ type: "whitelisted_domains", page: pageId }),
      },
      headers: { "Content-Type": "application/json", "x-api-key": this.apiKey },
    }).then((res) => {
      const setting = get(res.data, "results.objects.rows.0");
      return {
        id: setting._id,
        domains: setting.option,
        pageId: setting.page,
      } as WhitelistSetting;
    });
  }
  async updateWhiteListSetting(settingId: string, domains: string[]) {
    return Axios.put(
      `${host}/setting/${settingId}`,
      { option: domains },
      { headers: { "Content-Type": "application/json", "x-api-key": this.apiKey } }
    ).then((res) => {
      return get(res.data, "results.object");
    });
  }
  async getMenuSetting(pageId: string) {
    return Axios.get(`${host}/setting`, {
      params: {
        filter: JSON.stringify({ type: "persistent_menu", page: pageId }),
      },
      headers: { "Content-Type": "application/json", "x-api-key": this.apiKey },
    }).then((res) => {
      const setting = get(res.data, "results.objects.rows.0");
      if (!setting) return null;
      return {
        id: setting._id,
        pageId: pageId,
        actions: setting.option[0]["call_to_actions"],
      } as MenuSetting;
    });
  }
  async updateMenuSetting(settingId: string, actions: any[]) {
    return Axios.put(
      `${host}/setting/${settingId}`,
      {
        option: [
          {
            locale: "default",
            composer_input_disabled: false,
            call_to_actions: actions,
          },
        ],
      },
      { headers: { "Content-Type": "application/json", "x-api-key": this.apiKey } }
    ).then((res) => {
      return get(res.data, "results.object");
    });
  }
}

export type PageInfo = {
  id: string;
  appId: string;
  pageId: string;
  pageName: string;
  picture: string;
};

export type MessengerTokenDecoded = {
  pageId: string;
  psid: string;
  threadId: string;
};

type StoryInfo = {
  _id: string;
  name: string;
  page: string;
  isStarted: boolean;
  isUseRef: boolean;
};

type WhitelistSetting = {
  id: string;
  domains: string[];
  pageId: string;
};

type MenuSetting = {
  id: string;
  actions: any[];
  pageId: string;
};
