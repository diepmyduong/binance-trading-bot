import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { Context } from "../../context";
import { chatBotService } from "./chatBot.service";

const Query = {
  getAllChatBot: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN, ROLES.EDITOR]);
    return "Something Wrong"
  },
};

export default {
  Query
};
