import { set } from "lodash";

import { ROLES } from "../../../constants/role.const";
import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { Context } from "../../context";
import { customerVoucherService } from "./customerVoucher.service";

const Query = {
  getAllCustomerVoucher: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.MEMBER_STAFF_CUSTOMER);
    set(args, "q.filter.memberId", context.sellerId);
    if (context.isCustomer()) {
      set(args, "q.filter.customerId", context.id);
    }
    return customerVoucherService.fetch(args.q);
  },
  getOneCustomerVoucher: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.MEMBER_STAFF_CUSTOMER);
    const { id } = args;
    return await customerVoucherService.findOne({ _id: id });
  },
};

const CustomerVoucher = {
  voucher: GraphQLHelper.loadById(GraphQLHelper.loadById, "voucherId"),
};

export default {
  Query,
  CustomerVoucher,
};
