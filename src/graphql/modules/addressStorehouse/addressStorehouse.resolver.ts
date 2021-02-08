import { ErrorHelper } from "../../../base/error";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper, UtilsHelper } from "../../../helpers";
import { Context } from "../../context";
import { AddressHelper } from "../address/address.helper";
import { AddressStorehouseHelper } from "./addressStorehouse.helper";
import {
  AddressStorehouseModel,
  IAddressStorehouse,
} from "./addressStorehouse.model";
import { addressStorehouseService } from "./addressStorehouse.service";

const Query = {
  getAllAddressStorehouse: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN, ROLES.EDITOR]);
    return addressStorehouseService.fetch(args.q);
  },
  getOneAddressStorehouse: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN, ROLES.EDITOR]);
    const { id } = args;
    return await addressStorehouseService.findOne({ _id: id });
  },
};

const Mutation = {
  createAddressStorehouse: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN, ROLES.EDITOR]);
    const data: IAddressStorehouse = args.data;
    const { name, email, phone, address } = data;

    const storehouseByName = await AddressStorehouseModel.findOne({ name });
    if (storehouseByName) throw ErrorHelper.duplicateError("Tên kho");

    if (email && !UtilsHelper.isEmail(email))
      throw ErrorHelper.requestDataInvalid(".Email không đúng định dạng");

    const storehouseByMail = await AddressStorehouseModel.findOne({ email });
    if (email && storehouseByMail) {
      throw ErrorHelper.duplicateError("Email");
    }

    const storeHouseByPhone = await AddressStorehouseModel.findOne({ phone });
    if (phone && storeHouseByPhone) {
      throw ErrorHelper.duplicateError("Số điện thoại");
    }

    const storeHouseByAddress = await AddressStorehouseModel.findOne({
      address,
    });
    if (storeHouseByAddress) {
      throw ErrorHelper.duplicateError("Địa chỉ");
    }

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
    AuthHelper.acceptRoles(context, [ROLES.ADMIN, ROLES.EDITOR]);
    const { id } = args;
    const data: IAddressStorehouse = args.data;
    const { email } = data;

    const existedStorehouse = await AddressStorehouseModel.findById(id);
    if (!existedStorehouse) throw ErrorHelper.mgRecoredNotFound("kho");

    if (email && !UtilsHelper.isEmail(email))
      throw ErrorHelper.requestDataInvalid(".Email không đúng định dạng");

    return await addressStorehouseService.updateOne(id, data);
  },
  deleteOneAddressStorehouse: async (
    root: any,
    args: any,
    context: Context
  ) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { id } = args;
    return await addressStorehouseService.deleteOne(id);
  },
};

const AddressStorehouse = {};

export default {
  Query,
  Mutation,
  AddressStorehouse,
};
