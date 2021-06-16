import { ROLES } from "../../../constants/role.const";
import { AuthHelper, ErrorHelper, UtilsHelper } from "../../../helpers";
import { Context } from "../../context";
import { MemberModel } from "../member/member.model";
import { AddressDeliveryModel } from "./addressDelivery.model";

const Query = {
  getShopAddressDelivery: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.CUSTOMER]);

    const { provinceId, districtId, wardId, sellerId } = args;
    // console.log("sellerId", context.sellerId);
    const member = await MemberModel.findById(sellerId || context.sellerId);

    // console.log("member", member);
    if (!member) throw ErrorHelper.recoredNotFound("chủ shop");

    const params: any = {
      _id: { $in: member.addressDeliveryIds },
      activated: true,
    };

    provinceId ? (params.provinceId = provinceId) : null;
    districtId ? (params.districtId = districtId) : null;
    wardId ? (params.wardId = wardId) : null;
    const addresses = await AddressDeliveryModel.find(params);

    // console.log("address", addresses);

    return addresses;
  },
};
export default {
  Query,
};
