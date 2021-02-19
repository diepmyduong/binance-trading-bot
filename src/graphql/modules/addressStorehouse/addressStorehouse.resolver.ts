import { ErrorHelper } from "../../../base/error";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper, UtilsHelper } from "../../../helpers";
import { Context } from "../../context";
import { AddressHelper } from "../address/address.helper";
import { MemberModel } from "../member/member.model";
import { AddressStorehouseHelper } from "./addressStorehouse.helper";
import {
  AddressStorehouseModel,
  IAddressStorehouse,
} from "./addressStorehouse.model";
import { addressStorehouseService } from "./addressStorehouse.service";

const Query = {
  getAllAddressStorehouse: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
    return addressStorehouseService.fetch(args.q);
  },
  getOneAddressStorehouse: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
    const { id } = args;
    return await addressStorehouseService.findOne({ _id: id });
  },
};

const Mutation = {
  createAddressStorehouse: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
    const data: IAddressStorehouse = args.data;
    const { email } = data;

    if (email && !UtilsHelper.isEmail(email))
      throw ErrorHelper.requestDataInvalid(".Email không đúng định dạng");

    const helper = new AddressStorehouseHelper(
      new AddressStorehouseModel(data)
    );

    await Promise.all([
      AddressHelper.setProvinceName(helper.addressStorehouse),
      AddressHelper.setDistrictName(helper.addressStorehouse),
      AddressHelper.setWardName(helper.addressStorehouse),
    ]);

    return await helper.addressStorehouse.save();
  },

  updateAddressStorehouse: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
    const { id } = args;
    const data: IAddressStorehouse = args.data;
    const { email } = data;

    const existedStorehouse = await AddressStorehouseModel.findById(id);
    if (!existedStorehouse) throw ErrorHelper.mgRecoredNotFound("kho");

    if (email && !UtilsHelper.isEmail(email))
      throw ErrorHelper.requestDataInvalid(".Email không đúng định dạng");

    return await addressStorehouseService
      .updateOne(id, data)
      .then(async (res: IAddressStorehouse) => {
        const helper = new AddressStorehouseHelper(res);
        await Promise.all([
          AddressHelper.setProvinceName(helper.addressStorehouse),
          AddressHelper.setDistrictName(helper.addressStorehouse),
          AddressHelper.setWardName(helper.addressStorehouse),
        ]);
        return await helper.addressStorehouse.save();
      });
  },

  deleteOneAddressStorehouse: async (
    root: any,
    args: any,
    context: Context
  ) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
    const { id } = args;
    // const existedMemberfromAddress = MemberModel.find({ addressStorehouseIds :{$in:[] })
    return await addressStorehouseService.deleteOne(id);
  },
};

const AddressStorehouse = {};

export default {
  Query,
  Mutation,
  AddressStorehouse,
};
