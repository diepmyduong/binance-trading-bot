import { ErrorHelper } from "../../../../base/error";
import { SettingKey } from "../../../../configs/settingData";
import { ROLES } from "../../../../constants/role.const";
import { AuthHelper, KeycodeHelper } from "../../../../helpers";
import { ChatBotHelper } from "../../../../helpers/chatbot.helper";
import { Context } from "../../../context";
import { SettingHelper } from "../../setting/setting.helper";
import { MemberModel } from "../member.model";
import { ChatbotStory } from "../types/chatbotStory.type";
import { MemberHelper } from "../member.helper";

const Mutation = {
  connectChatbot: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.MEMBER]);
    const { apiKey } = args;
    const chatbotHelper = new ChatBotHelper(apiKey);
    const pageData = await chatbotHelper.getPageInfo();
    const existMember = await MemberModel.findOne({ fanpageId: pageData.pageId });
    if (existMember && existMember.id != context.tokenData._id) {
      throw ErrorHelper.requestDataInvalid(
        "Fanpage này đã được kết nối bởi thành viên khác.\nVui lòng sử dụng Fanpage khác."
      );
    }
    const member = await MemberModel.findById(context.tokenData._id);
    member.fanpageId = pageData.pageId;
    member.fanpageName = pageData.pageName;
    member.fanpageImage = pageData.picture;
    member.chatbotKey = apiKey;
    // Khởi tạo câu chuyện
    const [message, btnTitle, ref, webappDomain, name] = await SettingHelper.loadMany([
      SettingKey.STORY_MESSAGE,
      SettingKey.STORY_BTN_TITLE,
      SettingKey.STORY_REF,
      SettingKey.WEBAPP_DOMAIN,
      SettingKey.STORY_NAME,
    ]);
    const code = KeycodeHelper.alpha(member.fanpageId, 6);
    const chatbotStory = {
      name,
      message,
      btnTitle,
      ref: `${ref}-${code}`,
      webappDomain,
      pageId: pageData.id,
    } as ChatbotStory;
    const memberHelper = new MemberHelper(member);
    await memberHelper.generateChatbotStory(chatbotStory);
    // if (!member.chatbotStory || member.chatbotStory.pageId.toString() != pageData.id.toString()) {

    // }
    return await memberHelper.member.save();
  },
};

export default { Mutation };
