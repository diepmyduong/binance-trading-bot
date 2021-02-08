import { ErrorHelper } from "../../../base/error";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { Context } from "../../context";
import { UserModel } from "./user.model";

const Mutation = {
  userUpdateMe: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
    const { data } = args;
    // kiem tra user co phai chinh no
    const existedUser = await UserModel.findById(context.tokenData._id);
    if (!existedUser) throw ErrorHelper.permissionDeny();
    return await UserModel.findByIdAndUpdate(existedUser.id, { $set: data }, { new: true });
  },
};

export default {
  Mutation,
};
