import { ROLES } from "../../../constants/role.const";
import { authErrorPermissionDeny } from "../../../errors/auth.error";
import { notFoundHandler } from "../../../helpers/common";
import Firebase from "../../../helpers/firebase";
import { Context } from "../../context";
import { validatePassword } from "./common";
import { UserModel } from "./user.model";

const Mutation = {
  updateUserPassword: async (root: any, args: any, context: Context) => {
    const { id, password } = args;
    context.auth(ROLES.ADMIN_EDITOR);
    if (!context.isAdmin && context.id != id) throw authErrorPermissionDeny;
    validatePassword(password);
    const user = notFoundHandler(await UserModel.findById(id));
    await Firebase.auth.updateUser(user.uid, { password });
    return user;
  },
};

export default {
  Mutation,
};
