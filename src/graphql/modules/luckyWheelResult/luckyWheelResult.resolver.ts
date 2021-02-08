import { set } from "lodash";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { Context } from "../../context";
import { CustomerLoader } from "../customer/customer.model";
import { LuckyWheelLoader } from "../luckyWheel/luckyWheel.model";
import { LuckyWheelGiftLoader } from "../luckyWheelGift/luckyWheelGift.model";
import { MemberLoader } from "../member/member.model";
import { luckyWheelResultService } from "./luckyWheelResult.service";

const Query = {
  getAllLuckyWheelResult: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER_CUSTOMER);

    if (context.isCustomer()) {
      set(args, "q.filter.customerId", context.id);
    }

    return luckyWheelResultService.fetch(args.q);
  },

  getOneLuckyWheelResult: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER_CUSTOMER);
    const { id } = args;
    let params: any = { _id: id };
    // if (context.isCustomer()) {
    //   params.customerId = context.id;
    // }
    return await luckyWheelResultService.findOne(params);
  },
};

const Mutation = {
};

const LuckyWheelResult = {
  luckyWheelGift: GraphQLHelper.loadById(LuckyWheelGiftLoader, "giftId"),
  member: GraphQLHelper.loadById(MemberLoader, "memberId"),
  customer: GraphQLHelper.loadById(CustomerLoader, "customerId"),
  luckyWheel: GraphQLHelper.loadById(LuckyWheelLoader, "luckyWheelId"),
};

export default {
  Query,
  Mutation,
  LuckyWheelResult,
};
