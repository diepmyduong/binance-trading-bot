import { ROLES } from "../../../../constants/role.const";
import { ErrorHelper, firebaseHelper } from "../../../../helpers";
import { AuthHelper } from "../../../../helpers/auth.helper";
import { Context } from "../../../context";
import { AddressDeliveryModel } from "../../addressDelivery/addressDelivery.model";
import { memberService } from "../member.service";

const Mutation = {
  updateMemberAddressDelivery: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
    const { id, addressDeliveryIds } = args;

    const deliveryAddressLength = Object.keys(addressDeliveryIds).length;

    if (deliveryAddressLength === 0) {
      throw ErrorHelper.requestDataInvalid("mã kho");
    }
    const existedAddresses = await AddressDeliveryModel.find({_id: {$in: addressDeliveryIds}, activated : true});
    if ( Object.keys(existedAddresses).length  === 0) {
      throw ErrorHelper.recoredNotFound("Địa điểm nhận");
    }
    const validAddesses =
      Object.keys(existedAddresses).length === deliveryAddressLength;
    if (!validAddesses) {
      throw ErrorHelper.mgQueryFailed("Có 1 hoặc nhiều địa điểm nhận không còn hiệu lực.");
    }
    const data = {addressDeliveryIds};

    return await memberService.updateOne(id, data);
  },
};

export default {
  Mutation,
};
