import { set } from "lodash";
import { ErrorHelper } from "../../../base/error";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { Context } from "../../context";
import { DriverModel } from "./driver.model";
import { driverService } from "./driver.service";

const Query = {
  getAllDriver: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ADMIN_EDITOR_MEMBER_STAFF);
    if (context.sellerId) {
      set(args, "q.filter.memberId", context.sellerId);
    }
    return driverService.fetch(args.q);
  },
  getOneDriver: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ADMIN_EDITOR_MEMBER_STAFF);
    const { id } = args;
    return await driverService.findOne({ _id: id });
  },
};

const Mutation = {
  createDriver: async (root: any, args: any, context: Context) => {
    context.auth([ROLES.MEMBER]);
    const { data } = args;
    data.memberId = context.id;
    return await driverService.create(data);
  },
  updateDriver: async (root: any, args: any, context: Context) => {
    context.auth([ROLES.MEMBER]);
    const { id, data } = args;
    const driver = await DriverModel.findById(id);
    if (driver.memberId.toString() != context.id) throw ErrorHelper.permissionDeny();
    return await driverService.updateOne(id, data);
  },
  deleteOneDriver: async (root: any, args: any, context: Context) => {
    context.auth([ROLES.MEMBER]);
    const { id } = args;
    const driver = await DriverModel.findById(id);
    if (driver.memberId.toString() != context.id) throw ErrorHelper.permissionDeny();
    return await driverService.deleteOne(id);
  },
};

const Driver = {};

export default {
  Query,
  Mutation,
  Driver,
};
