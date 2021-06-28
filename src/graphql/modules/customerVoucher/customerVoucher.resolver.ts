import { set } from "lodash";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { Context } from "../../context";
import { ShopVoucherLoader } from "../shopVoucher/shopVoucher.model";
import { customerVoucherService } from "./customerVoucher.service";

const Query = {
  getAllCustomerVoucher: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ANONYMOUS_CUSTOMER_MEMBER_STAFF);
    set(args, "q.filter.memberId", context.sellerId);
    return customerVoucherService.fetch(args.q);
  },
  getOneCustomerVoucher: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ANONYMOUS_CUSTOMER_MEMBER_STAFF);
    const { id } = args;
    return await customerVoucherService.findOne({ _id: id });
  },
};

const CustomerVoucher = {
  voucher: GraphQLHelper.loadById(ShopVoucherLoader, "voucherId"),
};

export default {
  Query,
  CustomerVoucher,
};
