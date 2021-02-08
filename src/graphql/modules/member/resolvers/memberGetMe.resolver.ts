import { ROLES } from "../../../../constants/role.const";
import { AuthHelper } from "../../../../helpers";
import { Context } from "../../../context";
import { MemberModel } from "../member.model";

const Query = {
  memberGetMe: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.MEMBER]);
    return await MemberModel.findById(context.tokenData._id);
  },
};

export default {
  Query,
};
