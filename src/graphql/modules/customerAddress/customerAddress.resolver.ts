import { set } from "lodash";

import { ROLES } from "../../../constants/role.const";
import { Context } from "../../context";
import { addressService } from "../address/address.service";
import { CustomerAddressModel, ICustomerAddress } from "./customerAddress.model";
import { customerAddressService } from "./customerAddress.service";

const Query = {
  getAllCustomerAddress: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.CUSTOMER_MESSENGER);
    set(args, "q.filter.customerId", context.id);
    return customerAddressService.fetch(args.q);
  },
  getOneCustomerAddress: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.CUSTOMER_MESSENGER);
    const { id } = args;
    return await customerAddressService.findOne({ _id: id });
  },
};

const Mutation = {
  createCustomerAddress: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.CUSTOMER_MESSENGER);
    const { data } = args;
    const address = new CustomerAddressModel(data);
    address.customerId = context.id;
    await Promise.all([
      addressService.setProvinceName(address),
      addressService.setDistrictName(address),
      addressService.setWardName(address),
    ]);
    return await address.save().then(async (res) => {
      if (res.isDefault) {
        setDefault(res);
      }
      return res;
    });
  },
  updateCustomerAddress: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.CUSTOMER_MESSENGER);
    const { id, data } = args;
    return await customerAddressService.updateOne(id, data).then(async (res: ICustomerAddress) => {
      await Promise.all([
        addressService.setProvinceName(res),
        addressService.setDistrictName(res),
        addressService.setWardName(res),
      ]);
      if (res.isDefault) {
        await setDefault(res);
      }
      return res;
    });
  },
  deleteOneCustomerAddress: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.CUSTOMER_MESSENGER);
    const { id } = args;
    return await customerAddressService.deleteOne(id);
  },
};

const CustomerAddress = {};

export default {
  Query,
  Mutation,
  CustomerAddress,
};

async function setDefault(address: ICustomerAddress) {
  await CustomerAddressModel.updateMany(
    { isDefault: true, customerId: address.customerId },
    { $set: { isDefault: false } }
  ).exec();
  address.isDefault = true;
  await address.updateOne({ $set: { isDefault: true } }).exec();
  return address;
}
