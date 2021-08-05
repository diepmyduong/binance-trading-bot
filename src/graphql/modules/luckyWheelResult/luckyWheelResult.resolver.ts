import { set } from "lodash";

import { ROLES } from "../../../constants/role.const";
import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { Context } from "../../context";
import { CustomerLoader } from "../customer/customer.model";
import { luckyWheelResultService } from "./luckyWheelResult.service";

const Query = {
  getAllLuckyWheelResult: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.MEMBER_STAFF_CUSTOMER);
    set(args, "q.filter.memberId", context.sellerId);
    if (context.isCustomer()) {
      set(args, "q.filter.customerId", context.id);
    }
    return luckyWheelResultService.fetch(args.q);
  },
};

const LuckyWheelResult = {
  customer: GraphQLHelper.loadById(CustomerLoader, "customerId"),
};

export default {
  Query,
  LuckyWheelResult,
};
