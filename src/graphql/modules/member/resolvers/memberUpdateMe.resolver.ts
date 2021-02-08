import { ROLES } from "../../../../constants/role.const";
import { AuthHelper } from "../../../../helpers";
import { Context } from "../../../context";
import { MemberModel } from "../member.model";

const Mutation = {
  memberUpdateMe: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.MEMBER]);
    const { data } = args;
    return await MemberModel.findByIdAndUpdate(
      context.tokenData._id,
      { $set: data },
      { new: true }
    );
  },
};

export default {
  Mutation,
};
