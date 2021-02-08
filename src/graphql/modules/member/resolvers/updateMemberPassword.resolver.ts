import { ROLES } from "../../../../constants/role.const";
import { ErrorHelper, firebaseHelper } from "../../../../helpers";
import { AuthHelper } from "../../../../helpers/auth.helper";
import { Context } from "../../../context";
import { MemberModel } from "../member.model";

const Mutation = {
  updateMemberPassword: async (root: any, args: any, context: Context) => {
    const { memberId, password } = args;
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
    if (context.tokenData.role == ROLES.MEMBER) AuthHelper.isOwner(context, memberId);
    if (password.length < 6) {
      throw ErrorHelper.updateUserError("mật khẩu phải có ít nhất 6 ký tự");
    }
    const member = await MemberModel.findById(memberId);
    if (!member) {
      throw ErrorHelper.mgRecoredNotFound("người dùng");
    }
    try {
      return firebaseHelper.updateUser(member.uid, { password }).then((res) => member);
    } catch (error) {
      throw ErrorHelper.updateUserError(error);
    }
  },
};

export default {
  Mutation,
};
