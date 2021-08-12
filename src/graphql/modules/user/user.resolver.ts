import { ROLES } from "../../../constants/role.const";
import { onActivity } from "../../../events/onActivity.event";
import { AuthHelper, ErrorHelper, firebaseHelper, UtilsHelper } from "../../../helpers";
import { Context } from "../../context";
import { UserHelper } from "./user.helper";
import { IUser, UserModel, UserRole } from "./user.model";
import { userService } from "./user.service";

const Query = {
  getAllUser: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN, ROLES.EDITOR]);
    return userService.fetch(args.q);
  },
  getOneUser: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN, ROLES.EDITOR]);
    const { id } = args;
    return await userService.findOne({ _id: id });
  },
};

const Mutation = {
  createUser: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { data } = args;

    if (!UtilsHelper.isEmail(data.email))
      throw ErrorHelper.createUserError("email không đúng định dạng");
    if (data.password.length < 6)
      throw ErrorHelper.createUserError("mật khẩu phải có ít nhất 6 ký tự");
    const user = await UserModel.findOne({ email: data.email });
    if (user) {
      throw ErrorHelper.createUserError("email này đã có tài khoản");
    }

    if (!data.role) data.role = UserRole.EDITOR;
    const fbUser = await firebaseHelper.createUser(data.email, data.password);
    data.uid = fbUser.uid;
    delete data.password;
    const userHelper = new UserHelper(new UserModel(data));

    await Promise.all([
      userHelper.setProvinceName(),
      userHelper.setDistrictName(),
      userHelper.setWardName(),
    ]);

    return await userHelper
      .value()
      .save()
      .then((res) => {
        onActivity.next({
          username: context.tokenData.username || "",
          message: `Tạo người dùng`,
        });
        return res;
      });
  },
  updateUser: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
    const { id, data } = args;
    if (context.tokenData.role != ROLES.ADMIN) AuthHelper.isOwner(context, id);
    return await userService.updateOne(id, data).then(async (res: IUser) => {
      onActivity.next({
        username: context.tokenData.username || "",
        message: `Cập nhật người dùng`,
      });
      const userHelper = new UserHelper(res);
      await Promise.all([
        userHelper.setProvinceName(),
        userHelper.setDistrictName(),
        userHelper.setWardName(),
      ]);
      return await userHelper.value().save();
    });
  },
  deleteOneUser: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { id } = args;
    return await userService.deleteOne(id).then((res) => {
      onActivity.next({
        username: context.tokenData.username || "",
        message: `Xóa người dùng`,
      });
      return res;
    });
  },
  deleteManyUser: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { ids } = args;
    let result = await userService.deleteMany(ids);
    onActivity.next({
      username: context.tokenData.username || "",
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
