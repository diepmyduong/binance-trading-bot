import passwordHash from "password-hash";

import { ROLES } from "../../../../constants/role.const";
import { ErrorHelper } from "../../../../helpers";
import { Context } from "../../../context";
import { MemberModel } from "../member.model";

const Mutation = {
  updateMemberPassword: async (root: any, args: any, context: Context) => {
    let { memberId, password } = args;
    context.auth(ROLES.ADMIN_EDITOR_MEMBER);
    if (context.isMember()) memberId = context.sellerId;
    if (password.length < 6) {
      throw ErrorHelper.updateUserError("mật khẩu phải có ít nhất 6 ký tự");
    }
    const member = await MemberModel.findById(memberId);
    if (!member) {
      throw ErrorHelper.mgRecoredNotFound("người dùng");
    }
    try {
      member.password = passwordHash.generate(password);
      return member.save();
      // return firebaseHelper.updateUser(member.uid, { password }).then((res) => member);
    } catch (error) {
      throw ErrorHelper.updateUserError(error);
    }
  },
};

export default {
  Mutation,
};
