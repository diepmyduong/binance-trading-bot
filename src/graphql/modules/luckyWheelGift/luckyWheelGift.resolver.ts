import { ErrorHelper } from "../../../base/error";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { Context } from "../../context";
import { EVoucherLoader } from "../eVoucher/eVoucher.model";
import { ILuckyWheel, LuckyWheelLoader, LuckyWheelModel } from "../luckyWheel/luckyWheel.model";
import { ILuckyWheelGift, LuckyWheelGiftModel } from "./luckyWheelGift.model";
import { luckyWheelGiftService } from "./luckyWheelGift.service";

const Query = {
  getAllLuckyWheelGift: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER_CUSTOMER);
    return luckyWheelGiftService.fetch(args.q);
  },
  getOneLuckyWheelGift: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN, ROLES.EDITOR]);
    const { id } = args;
    return await luckyWheelGiftService.findOne({ _id: id });
  },
};


const LuckyWheelGift = {
  luckyWheel: GraphQLHelper.loadById(LuckyWheelLoader, "luckyWheelId"),
  eVoucher: GraphQLHelper.loadById(EVoucherLoader, "eVoucherId"),
};

export default {
  Query,
  LuckyWheelGift,
};
