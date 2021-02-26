import { ROLES } from "../../../constants/role.const";
import { AuthHelper, ErrorHelper, UtilsHelper } from "../../../helpers";
import { Context } from "../../context";
import { MemberModel } from "../member/member.model";
import { AddressDeliveryModel } from "./addressDelivery.model";

const Query = {
  getShopAddressDelivery: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.CUSTOMER]);
    // console.log("sellerId", context.sellerId);
    const member = await MemberModel.findById(context.sellerId);

    // console.log("member", member);
    if (!member) throw ErrorHelper.recoredNotFound("chủ shop");

    const addresses = await AddressDeliveryModel.find({
      _id: { $in: member.addressDeliveryIds },
      activated: true
    });

    // console.log("address", addresses);

    return addresses;
  },
};
export default {
  Query,
};
