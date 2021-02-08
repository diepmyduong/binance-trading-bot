import { ROLES } from "../../../constants/role.const";
import { AuthHelper, ErrorHelper, UtilsHelper } from "../../../helpers";
import { Context } from "../../context";
import { AddressHelper } from "../address/address.helper";
import { AddressDeliveryHelper } from "./addressDelivery.helper";
import { AddressDeliveryModel, IAddressDelivery } from "./addressDelivery.model";
import { addressDeliveryService } from "./addressDelivery.service";

const Query = {
  getAllAddressDelivery: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN, ROLES.EDITOR]);
    return addressDeliveryService.fetch(args.q);
  },
  getOneAddressDelivery: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN, ROLES.EDITOR]);
    const { id } = args;
    return await addressDeliveryService.findOne({ _id: id });
  },
};

const Mutation = {
  createAddressDelivery: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const data: IAddressDelivery = args.data;
    const { name, email, phone, address } = data;

    const locationByName = await AddressDeliveryModel.findOne({ name });
    if (locationByName) throw ErrorHelper.duplicateError("Tên kho");

    if (email) {
      if (!UtilsHelper.isEmail(email))
        throw ErrorHelper.requestDataInvalid(".Email không đúng định dạng");

      const locationByMail = await AddressDeliveryModel.findOne({ email });
      if (locationByMail) {
        throw ErrorHelper.duplicateError("Email");
      }
    }

    if (phone) {
      const locationByPhone = await AddressDeliveryModel.findOne({ phone });
      if (locationByPhone) {
        throw ErrorHelper.duplicateError("Số điện thoại");
      }
    }

    const locationByAddress = await AddressDeliveryModel.findOne({
      address,
    });
    if (locationByAddress) {
      throw ErrorHelper.duplicateError("Địa chỉ");
    }

    const helper = new AddressDeliveryHelper(
      new AddressDeliveryModel(data)
    );

    await Promise.all([
      AddressHelper.setProvinceName(helper.addressDelivery),
      AddressHelper.setDistrictName(helper.addressDelivery),
      AddressHelper.setWardName(helper.addressDelivery),
    ]);

    return await helper.addressDelivery.save();
  },
  updateAddressDelivery: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { id } = args;
    // return await addressDeliveryService.updateOne(id, data);
    const data: IAddressDelivery = args.data;
    const { email } = data;

    const existedLocation = await AddressDeliveryModel.findById(id);
    if (!existedLocation) throw ErrorHelper.mgRecoredNotFound("địa điểm nhận hàng");

    if (email && !UtilsHelper.isEmail(email))
      throw ErrorHelper.requestDataInvalid(".Email không đúng định dạng");

    return await addressDeliveryService
      .updateOne(id, data)
      .then(async (res: IAddressDelivery) => {
        const helper = new AddressDeliveryHelper(res);
        await Promise.all([
          AddressHelper.setProvinceName(helper.addressDelivery),
          AddressHelper.setDistrictName(helper.addressDelivery),
          AddressHelper.setWardName(helper.addressDelivery),
        ]);
        return await helper.addressDelivery.save();
      });

  },
  deleteOneAddressDelivery: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { id } = args;
    return await addressDeliveryService.deleteOne(id);
  },
};

const AddressDelivery = {
  
};

export default {
  Query,
  Mutation,
  AddressDelivery,
};
