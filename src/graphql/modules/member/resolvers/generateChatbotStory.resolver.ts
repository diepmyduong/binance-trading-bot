import { SettingKey } from "../../../../configs/settingData";
import { ROLES } from "../../../../constants/role.const";
import { ChatBotHelper } from "../../../../helpers/chatbot.helper";
import { Context } from "../../../context";
import { SettingHelper } from "../../setting/setting.helper";
import { MemberModel } from "../member.model";
import { ErrorHelper } from "../../../../helpers/error.helper";
import { ChatbotStory } from "../types/chatbotStory.type";
import { MemberHelper } from "../member.helper";

const Mutation = {
  generateChatbotStory: async (root: any, args: any, context: Context) => {
    context.auth([ROLES.MEMBER]);
    const { data } = args;
    const member = await MemberModel.findById(context.id);
    if (!member.chatbotKey) throw ErrorHelper.memberNotConnectedChatbot();
    const chatbotHelper = new ChatBotHelper(member.chatbotKey);
    const pageData = await chatbotHelper.getPageInfo();
    const [ashopDomain] = await SettingHelper.loadMany([SettingKey.WEBAPP_DOMAIN]);
    const chatbotStory = data as ChatbotStory;
    chatbotStory.webappDomain = ashopDomain;
    chatbotStory.pageId = pageData.id;
    const memberHelper = new MemberHelper(member);
    await memberHelper.generateChatbotStory(chatbotStory);
    return await member.save();
  },
};

export default { Mutation };
