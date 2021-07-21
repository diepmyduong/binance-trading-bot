import { ROLES } from "../../../constants/role.const";
import { Context } from "../../context";
import { AddressHelper } from "../address/address.helper";
import { MemberModel } from "../member/member.model";
import { ShopRegistionStatus, ShopRegistrationModel } from "./shopRegistration.model";
import { shopRegistrationService } from "./shopRegistration.service";

const Query = {
  getAllShopRegistration: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ADMIN_EDITOR);
    return shopRegistrationService.fetch(args.q);
  },
  getOneShopRegistration: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ADMIN_EDITOR);
    const { id } = args;
    return await shopRegistrationService.findOne({ _id: id });
  },
};

const Mutation = {
  createShopRegistration: async (root: any, args: any, context: Context) => {
    const { data } = args;
    await AddressHelper.setAddress(data);
    if (await MemberModel.findOne({ username: data.email })) throw Error("Email đã được sử dụng.");
    if (await MemberModel.findOne({ code: data.shopCode }))
      throw Error("Mã cửa hàng đã được sử dụng");
    if (
      await ShopRegistrationModel.findOne({
        email: data.email,
        status: ShopRegistionStatus.PENDING,
      })
    )
      throw Error("Email đã được sử dụng");
    if (
      await ShopRegistrationModel.findOne({
        shopCode: data.shopCode,
        status: ShopRegistionStatus.PENDING,
      })
    )
      throw Error("Mã cửa hàng đã được sử dụng");
    return await shopRegistrationService.create(data);
  },
};

const ShopRegistration = {};

export default {
  Query,
  Mutation,
  ShopRegistration,
};
