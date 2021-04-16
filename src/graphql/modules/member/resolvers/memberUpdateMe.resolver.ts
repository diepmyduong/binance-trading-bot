import { ROLES } from "../../../../constants/role.const";
import { AuthHelper } from "../../../../helpers";
import { Context } from "../../../context";
import { AddressDeliveryModel } from "../../addressDelivery/addressDelivery.model";
import { AddressStorehouseModel } from "../../addressStorehouse/addressStorehouse.model";
import { MemberModel } from "../member.model";

const Mutation = {
  memberUpdateMe: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.MEMBER]);
    const { data } = args;
    return await MemberModel.findByIdAndUpdate(
      context.tokenData._id,
      { $set: data },
      { new: true }
    ).then(async (updated) => {
      const member = await MemberModel.findById(context.tokenData._id);
      await Promise.all([
        AddressDeliveryModel.findOneAndUpdate({ code: member.code }, {
          $set: {
            phone: member.phone,
            address: member.address,
            district: member.district,
            districtId: member.districtId,
            ward: member.ward,
            wardId: member.wardId,
            province: member.province,
            provinceId: member.provinceId,
            name: member.shopName,
          }
        }, { new: true }),
        AddressStorehouseModel.findOneAndUpdate({ code: member.code }, {
          $set: {
            phone: member.phone,
            address: member.address,
            district: member.district,
            districtId: member.districtId,
            ward: member.ward,
            wardId: member.wardId,
            province: member.province,
            provinceId: member.provinceId,
            name: member.shopName,
          }
        }, { new: true })
      ]);
    });
  },
};

export default {
  Mutation,
};
