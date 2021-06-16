import { set } from "lodash";
import passwordHash from "password-hash";

import { ROLES } from "../../../constants/role.const";
import { Context } from "../../context";
import { StaffModel } from "./staff.model";
import { staffService } from "./staff.service";

const Query = {
  getAllStaff: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ADMIN_EDITOR_MEMBER);
    if (context.isMember()) {
      set(args, "q.filter.memberId", context.id);
    }
    return staffService.fetch(args.q);
  },
  getOneStaff: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ADMIN_EDITOR_MEMBER);
    const { id } = args;
    return await staffService.findOne({ _id: id });
  },
};

const Mutation = {
  createStaff: async (root: any, args: any, context: Context) => {
    context.auth([ROLES.MEMBER]);
    const { password, ...data } = args.data;
    const user = await StaffModel.findOne({ memberId: context.id, username: data.username });
    if (user) throw Error("Tên đăng nhập đã tồn tại.");
    if (password.length < 6) throw Error("Mật khẩu quá ngắn. Yêu cầu từ 6 ký tự trở lên.");
    data.hashPassword = passwordHash.generate(password);
    data.memberId = context.id;
    return await staffService.create(data);
  },
  updateStaff: async (root: any, args: any, context: Context) => {
    context.auth([ROLES.MEMBER]);
    const { id, data } = args;
    return await staffService.updateOne(id, data);
  },
  deleteOneStaff: async (root: any, args: any, context: Context) => {
    context.auth([ROLES.MEMBER]);
    const { id } = args;
    return await staffService.deleteOne(id);
  },
};

const Staff = {};

export default {
  Query,
  Mutation,
  Staff,
};
