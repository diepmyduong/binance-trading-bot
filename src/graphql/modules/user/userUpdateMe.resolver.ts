import { ROLES } from "../../../constants/role.const";
import { authErrorPermissionDeny } from "../../../errors/auth.error";
import { Context } from "../../context";
import { UserModel } from "./user.model";

const Mutation = {
  userUpdateMe: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ADMIN_EDITOR);
    const { data } = args;
    // kiem tra user co phai chinh no
    const existedUser = await UserModel.findById(context.token._id);
    if (!existedUser) throw authErrorPermissionDeny;
    return await UserModel.findByIdAndUpdate(existedUser.id, { $set: data }, { new: true });
  },
};

export default {
  Mutation,
};
