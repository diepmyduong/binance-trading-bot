import { IMember, MemberModel } from "./member.model";
import { TokenHelper } from "../../../helpers/token.helper";
import { ROLES } from "../../../constants/role.const";
import { Context } from "../../context";
import { ErrorHelper } from "../../../base/error";
import { MemberSubscriber } from "./loaders/memberSubscriber.loader";
import { ChatbotStory } from "./types/chatbotStory.type";
import { ChatBotHelper } from "../../../helpers/chatbot.helper";
import { compact } from "lodash";

export class MemberHelper {
  constructor(public member: IMember) {}

  static async fromContext(context: Context) {
    if (![ROLES.MEMBER].includes(context.tokenData.role)) return null;
    const member = await MemberModel.findById(context.tokenData._id);
    if (!member) throw ErrorHelper.permissionDeny();
    return new MemberHelper(member);
  }

  setActivedAt() {
    if (this.member.activated && !this.member.activedAt) {
      this.member.activedAt = new Date();
    }
    return this;
  }

  getToken() {
    return TokenHelper.generateToken({
      role: ROLES.MEMBER,
      _id: this.member._id,
      username: this.member.name || this.member.username,
    });
  }

  getSubscribers() {
    if (!this.member.chatbotKey) return;
    if (!this.member.psids || this.member.psids.length == 0) return [] as any[];
    return MemberSubscriber.getLoader(this.member.chatbotKey).loadMany(compact(this.member.psids));
  }

  async generateChatbotStory({ pageId, name, ref, message, btnTitle, webappDomain }: ChatbotStory) {
    const chatbotHelper = new ChatBotHelper(this.member.chatbotKey);
    const story = await chatbotHelper.createStory(pageId, name);
    // Cấu hình câu chuyện đầu tiên
    await chatbotHelper.setGetStartedStories(pageId, story._id);
    // Mở cấu hình link
    await chatbotHelper.updateStory(story._id, { isUseRef: true, ref });
    // Thêm nội dung kịch bản
    await chatbotHelper.addCard(story._id, {
      type: "button",
      option: {
        attachment: {
          type: "template",
          payload: {
            template_type: "button",
            text: message,
            buttons: [
              {
                type: "web_url",
                title: btnTitle,
                buttonTag: "",
                url: webappDomain,
                messenger_extensions: false,
              },
            ],
          },
        },
      },
    });
    // Cấu hình menu
    const menuSetting = await chatbotHelper.getMenuSetting(pageId);
    if (menuSetting) {
      await chatbotHelper.updateMenuSetting(menuSetting.id, [
        {
          type: "postback",
          title: btnTitle,
          payload: JSON.stringify({ type: "story", data: story._id }),
        },
      ]);
    }

    this.member.chatbotStory = {
      pageId: pageId,
      storyId: story._id,
      name: story.name,
      isStarted: true,
      isUseRef: true,
      ref,
      btnTitle,
      message,
    };
  }
}
