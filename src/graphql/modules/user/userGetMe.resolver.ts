import { ROLES } from "../../../constants/role.const";
import { Context } from "../../context";
import { UserModel } from "./user.model";

const Query = {
  userGetMe: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ADMIN_EDITOR);
    return await UserModel.findById(context.token._id);
  },
};

export default {
  Query,
};
