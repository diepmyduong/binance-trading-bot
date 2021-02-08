import { ErrorHelper } from "../../../base/error";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { Context } from "../../context";
import { CustomerModel, ICustomer } from "../customer/customer.model";
import { EVoucherLoader, EVoucherModel } from "../eVoucher/eVoucher.model";
import { LuckyWheelModel } from "../luckyWheel/luckyWheel.model";
import { LuckyWheelGiftModel } from "../luckyWheelGift/luckyWheelGift.model";
import { LuckyWheelResultModel } from "../luckyWheelResult/luckyWheelResult.model";
import { EVoucherItemModel, IEVoucherItem } from "./eVoucherItem.model";
import { eVoucherItemService } from "./eVoucherItem.service";

const Query = {
  getAllEVoucherItem: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN, ROLES.EDITOR]);
    return eVoucherItemService.fetch(args.q);
  },
  getOneEVoucherItem: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN, ROLES.EDITOR]);
    const { id } = args;
    return await eVoucherItemService.findOne({ _id: id });
  },
};

const Mutation = {
  deleteOneEVoucherItem: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { id } = args;

    const existedEvoucherItem = await EVoucherItemModel.findById(id);
    if (!existedEvoucherItem)
      throw ErrorHelper.mgRecoredNotFound("mã voucher này.");

    if (existedEvoucherItem.activated)
      throw ErrorHelper.requestDataInvalid(". Mã voucher này đã được dùng.");

    return await eVoucherItemService.deleteOne(id);
  },

  deleteAllEvoucherItems: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { eVoucherId, onlyDeleteUnused } = args;

    const eVoucher = await EVoucherModel.findById(eVoucherId);

    let deletedCount = 0;
    let remainCount = 0;
    if (!eVoucher) throw ErrorHelper.mgRecoredNotFound("Mã voucher");
    if (onlyDeleteUnused) {
      const removal = await EVoucherItemModel.remove({
        eVoucherId,
        activated: false,
      });

      if (removal) {
        deletedCount = removal.deletedCount;
      }

      remainCount = await EVoucherItemModel.count({
        eVoucherId: eVoucher._id,
        activated: true,
      });
    } else {
      const result = await EVoucherItemModel.remove({ eVoucherId });
      deletedCount = result.deletedCount;
    }

    return { deletedCount, remainCount };
  },
};

const EVoucherItem = {
  eVoucher: GraphQLHelper.loadById(EVoucherLoader, "eVoucherId"),
  customer: async (root: IEVoucherItem, args: any, context: Context) => {
    const { id: eVoucherItemId } = root;
    const luckyWheelgiftResult = await LuckyWheelResultModel.findOne({
      eVoucherItemId,
    });
    const customer = luckyWheelgiftResult
      ? await CustomerModel.findById(luckyWheelgiftResult.customerId)
      : null;
    return customer;
  },
  luckyWheel: async (root: IEVoucherItem, args: any, context: Context) => {
    const { id: eVoucherItemId } = root;
    const luckyWheelgiftResult = await LuckyWheelResultModel.findOne({
      eVoucherItemId,
    });
    const luckyWheel = luckyWheelgiftResult
      ? await LuckyWheelModel.findById(luckyWheelgiftResult.luckyWheelId)
      : null;
    return luckyWheel;
  },
};

export default {
  Query,
  Mutation,
  EVoucherItem,
};
