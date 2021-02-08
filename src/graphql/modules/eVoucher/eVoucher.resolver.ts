import { ROLES } from "../../../constants/role.const";
import { AuthHelper, ErrorHelper } from "../../../helpers";
import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { Context } from "../../context";
import {
  EVoucherItemLoader,
  EVoucherItemModel,
} from "../eVoucherItem/eVoucherItem.model";
import { LuckyWheelGiftHelper } from "../luckyWheelGift/luckyWheelGift.helper";
import { LuckyWheelGiftModel } from "../luckyWheelGift/luckyWheelGift.model";
import { LuckyWheelResultModel } from "../luckyWheelResult/luckyWheelResult.model";
import { EVoucherModel, IEVoucher } from "./eVoucher.model";
import { eVoucherService } from "./eVoucher.service";

const Query = {
  getAllEVoucher: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
    return eVoucherService.fetch(args.q);
  },
  getOneEVoucher: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
    const { id } = args;
    return await eVoucherService.findOne({ _id: id });
  },
};

const Mutation = {
  deleteOneEVoucher: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
    const { id } = args;

    const [
      eVoucher,
      existedLuckyGift,
      exitedLuckyWheelResult,
    ] = await Promise.all([
      EVoucherModel.findById(id),
      LuckyWheelGiftModel.findOne({ eVoucherId: id }),
      LuckyWheelResultModel.findOne({ eVoucherId: id }),
    ]);
    let result: IEVoucher = null;
    if (!eVoucher) throw ErrorHelper.mgRecoredNotFound("Nhóm eVoucher");
    if (existedLuckyGift)
      throw ErrorHelper.requestDataInvalid(
        ". Nhóm mã này có vòng quay sử dụng."
      );

    if (exitedLuckyWheelResult)
      throw ErrorHelper.requestDataInvalid(". Nhóm mã này đã được dùng.");

    await Promise.all([
      EVoucherItemModel.remove({ eVoucherId: id, activated: false }),
      EVoucherModel.findByIdAndDelete(id),
    ]).then(([, eVoucher]) => {
      result = eVoucher;
    });

    return result;
  },
};

const EVoucher = {
  eVoucherItems: async (root: IEVoucher, args: any, context: Context) => {
    const items = await EVoucherItemModel.find({ eVoucherId: root._id });
    return items;
  },
  itemCount: async (root: IEVoucher, args: any, context: Context) => {
    const items = await EVoucherItemModel.count({ eVoucherId: root._id });
    return items;
  },
  usedCount: async (root: IEVoucher, args: any, context: Context) => {
    const items = await EVoucherItemModel.count({
      eVoucherId: root._id,
      activated: true,
    });
    return items;
  },
  unUsedCount: async (root: IEVoucher, args: any, context: Context) => {
    const items = await EVoucherItemModel.count({
      eVoucherId: root._id,
      activated: false,
    });
    return items;
  },
};

export default {
  Query,
  Mutation,
  EVoucher,
};
