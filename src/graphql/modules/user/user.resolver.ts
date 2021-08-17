import BaseError from "../../../base/error";
import { ROLES } from "../../../constants/role.const";
import { authErrorPermissionDeny } from "../../../errors/auth.error";
import { onActivity } from "../../../events/onActivity.event";
import { notFoundHandler } from "../../../helpers/common";
import Firebase from "../../../helpers/firebase";
import { Context } from "../../context";
import { validateEmail, validatePassword } from "./common";
import { UserHelper } from "./user.helper";
import { IUser, UserModel, UserRole } from "./user.model";
import { userService } from "./user.service";

const Query = {
  getAllUser: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ADMIN_EDITOR);
    return userService.fetch(args.q);
  },
  getOneUser: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ADMIN_EDITOR);
    const { id } = args;
    return await userService.findOne({ _id: id });
  },
};

const Mutation = {
  createUser: async (root: any, args: any, context: Context) => {
    context.auth([ROLES.ADMIN]);
    const { data } = args;
    validateEmail(data.email);
    validatePassword(data.password);
    const user = await UserModel.findOne({ email: data.email });
    if (user) {
      throw new BaseError("create-user-error", "Email này đã có tài khoản");
    }
    if (!data.role) data.role = UserRole.EDITOR;
    const fbUser = await Firebase.auth.createUser({ email: data.email, password: data.password });
    data.uid = fbUser.uid;
    delete data.password;
    const newUser = await new UserModel(data).save();
    onActivity.next({
      username: context.token.payload.username || "",
      message: `Tạo người dùng`,
    });
    return newUser;
  },
  updateUser: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ADMIN_EDITOR);
    const { id, data } = args;
    if (!context.isAdmin && context.id != id) throw authErrorPermissionDeny;
    return await userService.updateOne(id, data).then(async (res: IUser) => {
      onActivity.next({
        username: context.token.payload.username || "",
        message: `Cập nhật người dùng`,
      });
      return res;
    });
  },
  deleteOneUser: async (root: any, args: any, context: Context) => {
    context.auth([ROLES.ADMIN]);
    const { id } = args;
    let user = notFoundHandler(await UserModel.findById(id));
    await Firebase.auth.deleteUser(user.uid);
    return await userService.deleteOne(id).then((res) => {
      onActivity.next({
        username: context.token.payload.username || "",
        message: `Xóa người dùng`,
      });
      return res;
    });
  },
  deleteManyUser: async (root: any, args: any, context: Context) => {
    context.auth([ROLES.ADMIN]);
    const { ids } = args;
    const users = await UserModel.find({ _id: { $in: ids } });
    await Firebase.auth.deleteUsers(users.map((u) => u.uid.toString()));
    let result = await userService.deleteMany(ids);
    onActivity.next({
      username: context.token.payload.username || "",
      message: `Xóa người dùng`,
    });
    return result;
  },
};

const User = {
  unseenNotify: async (root: IUser, args: any, context: Context) => {
    return await new UserHelper(root).getUnseenNotify();
  },
};

export default {
  Query,
  Mutation,
  User,
};
