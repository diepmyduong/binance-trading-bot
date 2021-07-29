import { gql } from "apollo-server-express";
import moment from "moment-timezone";
import { ROLES } from "../../../constants/role.const";
import { Context } from "../../context";
import { ShopVoucherModel } from "./shopVoucher.model";

export default {
  schema: gql`
    extend type Query {
      getShopVoucherByCode(code: String!): ShopVoucher
    }
  `,
  resolver: {
    Query: {
      getShopVoucherByCode: async (root: any, args: any, context: Context) => {
        context.auth(ROLES.MEMBER_STAFF_CUSTOMER);
        const voucher = await ShopVoucherModel.findOne({
          memberId: context.sellerId,
          code: args.code,
          isActive: true,
        });
        try {
          if (!voucher) throw Error();
          if (voucher.startDate && moment(voucher.startDate).isAfter(new Date())) throw Error();
          if (voucher.endDate && moment(voucher.endDate).isBefore(new Date())) throw Error();
          return voucher;
        } catch (err) {
          throw Error("Mã ưu đãi không hợp lệ");
        }
      },
    },
  },
};
