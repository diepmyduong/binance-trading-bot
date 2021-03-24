import { ROLES } from "../../../../constants/role.const";
import { AuthHelper } from "../../../../helpers";
import { Context } from "../../../context";
import { MemberModel } from "../member.model";
import { AddressDeliveryModel } from "../../addressDelivery/addressDelivery.model";
import { AddressStorehouseModel } from "../../addressStorehouse/addressStorehouse.model";
import { ErrorHelper } from "../../../../base/error";

const Mutation = {
  updateAllAddressDelivery: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.MEMBER]);
    const { id } = args;
    let memberId = id;
    if (context.isMember()) {
      memberId = context.id;
    }

    const member = await MemberModel.findById(memberId);
    if (!member) throw ErrorHelper.requestDataInvalid("mã nhân viên");

    const addressDeliverys = await AddressDeliveryModel.find({ isPost: true });
    const addressDeliveryIds = addressDeliverys.map((address) => address.id);


    for (const id of member.addressDeliveryIds) {
      if (!addressDeliveryIds.find(addrId => addrId === id.toString())) {
        addressDeliveryIds.push(id);
      }
    }

    return await MemberModel.findByIdAndUpdate(
      member.id,
      { $set: { addressDeliveryIds } },
      { new: true }
    );
  },
};

export default {
  Mutation,
};
