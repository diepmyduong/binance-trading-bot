import { Context } from "../../context";
import { UserModel } from "./user.model";
import { AuthHelper } from "../../../helpers/auth.helper";
import { ROLES } from "../../../constants/role.const";
import { firebaseHelper, ErrorHelper } from "../../../helpers";

const Mutation = {
  updateUserPassword: async (root: any, args: any, context: Context) => {
    const { id, password } = args;
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
    if (context.tokenData.role != ROLES.ADMIN) AuthHelper.isOwner(context, id);
    if (password.length < 6) {
      throw ErrorHelper.updateUserError("mật khẩu phải có ít nhất 6 ký tự");
    }
    const user = await UserModel.findById(id);
    if (!user) {
      throw ErrorHelper.mgRecoredNotFound("người dùng");
    }
    try {
      return firebaseHelper.updateUser(user.uid, { password }).then((res) => user);
    } catch (error) {
      throw ErrorHelper.updateUserError(error);
    }
  },
};

export default {
  Mutation,
};
