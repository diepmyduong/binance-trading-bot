import _, { set } from "lodash";

import { ErrorHelper } from "../../../base/error";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { Context } from "../../context";
import { LuckyWheelHelper } from "./luckyWheel.helper";
import { LuckyWheelLoader } from "./luckyWheel.model";
import { luckyWheelService } from "./luckyWheel.service";

const Query = {
  getAllLuckyWheel: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.MEMBER_STAFF_CUSTOMER);
    set(args, "q.filter.memberId", context.sellerId);
    if (context.isCustomer()) {
      set(args, "q.filter.isActive", true);
      set(args, "q.filter.isPrivate", false);
      set(args, "q.filter.startDate", { $lte: new Date() });
      set(args, "q.filter.endDate", { $gte: new Date() });
    }
    return luckyWheelService.fetch(args.q);
  },
  getOneLuckyWheel: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.MEMBER_STAFF_CUSTOMER);
    const { id } = args;
    return await luckyWheelService.findOne({ _id: id });
  },
};

const Mutation = {
  createLuckyWheel: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.MEMBER]);
    const { data } = args;
    data.memberId = context.sellerId;
    data.code = data.code || (await LuckyWheelHelper.generateCode());
    return await luckyWheelService.create(data);
  },

  updateLuckyWheel: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.MEMBER]);
    const { id, data } = args;
    await protectDoc(id, context);
    return await luckyWheelService.updateOne(id, data);
  },

  deleteOneLuckyWheel: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.MEMBER]);
    const { id } = args;
    await protectDoc(id, context);
    return await luckyWheelService.deleteOne(id);
  },
};

const LuckyWheel = {
  successRatio: GraphQLHelper.requireRoles(ROLES.MEMBER_STAFF, null),
  designConfig: GraphQLHelper.requireRoles(ROLES.MEMBER_STAFF, null),
  issueNumber: GraphQLHelper.requireRoles(ROLES.MEMBER_STAFF, null),
  issueByDate: GraphQLHelper.requireRoles(ROLES.MEMBER_STAFF, null),
  useLimit: GraphQLHelper.requireRoles(ROLES.MEMBER_STAFF, null),
  useLimitByDate: GraphQLHelper.requireRoles(ROLES.MEMBER_STAFF, null),
};

export default {
  Query,
  Mutation,
  LuckyWheel,
};
async function protectDoc(id: any, context: Context) {
  const wheel = await LuckyWheelLoader.load(id);
  if (!wheel || wheel.memberId.toString() != context.id) throw ErrorHelper.permissionDeny();
}
