import { set } from "lodash";

import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { Context } from "../../context";
import { MemberHelper } from "../member/member.helper";
import { MemberLoader } from "../member/member.model";
import { customerService } from "./customer.service";

const Query = {
  getAllCustomer: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
    const memberHelper = await MemberHelper.fromContext(context);
    if (memberHelper) {
      set(args, "q.filter.pageAccounts", { $elemMatch: { memberId: memberHelper.member._id } });
    }
    return customerService.fetch(args.q);
  },
  getOneCustomer: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
    const { id } = args;
    return await customerService.findOne({ _id: id });
  },
};

const Mutation = {};

const Customer = {};

const CustomerPageAccount = {
  member: GraphQLHelper.loadById(MemberLoader, "memberId"),
};

export default {
  Query,
  Mutation,
  Customer,
  CustomerPageAccount,
};
