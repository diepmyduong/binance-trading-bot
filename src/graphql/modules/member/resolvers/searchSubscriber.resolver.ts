import { Context } from "../../../context";
import { ROLES } from "../../../../constants/role.const";
import { SettingHelper } from "../../setting/setting.helper";
import { SettingKey } from "../../../../configs/settingData";
import { ChatBotHelper } from "../../../../helpers/chatbot.helper";
import { MemberModel } from "../member.model";

const Query = {
  searchSubscriber: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ADMIN_EDITOR_MEMBER);
    const { query } = args;
    let apiKey;
    if (context.isMember()) {
      const member = await MemberModel.findById(context.id);
      apiKey = member.chatbotKey;
    } else {
      apiKey = await SettingHelper.load(SettingKey.CHATBOT_API_KEY);
    }
    const chatbotHelper = new ChatBotHelper(apiKey);
    return await chatbotHelper.searchSubscriber(query);
  },
};

export default { Query };
