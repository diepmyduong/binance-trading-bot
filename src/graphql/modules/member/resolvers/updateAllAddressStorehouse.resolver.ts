import { ROLES } from "../../../../constants/role.const";
import { AuthHelper } from "../../../../helpers";
import { Context } from "../../../context";
import { MemberModel } from "../member.model";
import { AddressDeliveryModel } from "../../addressDelivery/addressDelivery.model";
import { AddressStorehouseModel } from "../../addressStorehouse/addressStorehouse.model";
import { ErrorHelper } from "../../../../base/error";

const Mutation = {
  updateAllAddressStorehouse: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
    const { id } = args;
    let memberId = id;
    if (context.isMember()) {
      memberId = context.id;
    }

    const member = await MemberModel.findById(memberId);
    if (!member) throw ErrorHelper.requestDataInvalid("mã nhân viên");

    const addressStorehouses = await AddressStorehouseModel.find({
      isPost: true, allowPickup: true
    });

    const addressStorehouseIds = addressStorehouses.map((address) => address.id);

    for (const id of member.addressStorehouseIds) {
      if (!addressStorehouseIds.find(addrId => addrId === id.toString())) {
        addressStorehouseIds.push(id);
      }
    }

    return await MemberModel.findByIdAndUpdate(
      member.id,
      { $set: { addressStorehouseIds } },
      { new: true }
    );
  },
};

export default {
  Mutation,
};
