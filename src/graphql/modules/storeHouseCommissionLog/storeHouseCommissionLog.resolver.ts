import { set } from "lodash";
import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { Context } from "../../context";
import { MemberHelper } from "../member/member.helper";
import { OrderLoader } from "../order/order.model";
import { storeHouseCommissionLogService } from "./storeHouseCommissionLog.service";

const Query = {
  getAllStoreHouseCommissionLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
    const memberHelper = await MemberHelper.fromContext(context);
    if (memberHelper) {
      set(args, "q.filter.memberId", memberHelper.member._id);
    }
    return storeHouseCommissionLogService.fetch(args.q);
  },
  getOneStoreHouseCommissionLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN, ROLES.EDITOR]);
    const { id } = args;
    return await storeHouseCommissionLogService.findOne({ _id: id });
  },
};

const Mutation = {
  deleteOneStoreHouseCommissionLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { id } = args;
    return await storeHouseCommissionLogService.deleteOne(id);
  },
};

const StoreHouseCommissionLog = {
  order: GraphQLHelper.loadById(OrderLoader, "orderId"),
};

export default {
  Query,
  Mutation,
  StoreHouseCommissionLog,
};
