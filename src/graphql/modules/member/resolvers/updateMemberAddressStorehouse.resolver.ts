import { ROLES } from "../../../../constants/role.const";
import { ErrorHelper, firebaseHelper } from "../../../../helpers";
import { AuthHelper } from "../../../../helpers/auth.helper";
import { Context } from "../../../context";
import {
  AddressStorehouseLoader,
  AddressStorehouseModel,
} from "../../addressStorehouse/addressStorehouse.model";
import { GraphQLHelper } from "../../../../helpers/graphql.helper";
import { memberService } from "../member.service";

const Mutation = {
  updateMemberAddressStorehouse: async (
    root: any,
    args: any,
    context: Context
  ) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
    const { id, addressStorehouseIds, mainAddressStorehouseId } = args;

    const storehouseLength = Object.keys(addressStorehouseIds).length;
    if (storehouseLength === 0) {
      throw ErrorHelper.requestDataInvalid("mã kho");
    }
    
    if (!addressStorehouseIds.includes(mainAddressStorehouseId)) {
      throw ErrorHelper.requestDataInvalid(". Không có kho chính");
    }
    
    const existedAddresses = await AddressStorehouseModel.find({
      _id: { $in: addressStorehouseIds },
    });
    const validAddesses =
      Object.keys(existedAddresses).length === storehouseLength;
    if (!validAddesses) {
      throw ErrorHelper.recoredNotFound("mã kho");
    }


    const data = { addressStorehouseIds, mainAddressStorehouseId };
    return await memberService.updateOne(id, data);
  },
};

export default {
  Mutation,
};
