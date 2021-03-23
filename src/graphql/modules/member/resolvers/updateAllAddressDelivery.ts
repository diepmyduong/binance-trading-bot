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

    const member = await MemberModel.findById(id);
    if (!member) throw ErrorHelper.requestDataInvalid("mã nhân viên");

    const addressDeliverys = await AddressDeliveryModel.find({ isPost: true });
    const addressDeliveryIds:any[] = addressDeliverys.map((id) => id);
    

    for (const id of member.addressDeliveryIds) {
        if(!addressDeliveryIds.find(addrId => addrId === id.toString())){
          addressDeliveryIds.push(id);
        }
    }

    const params: any = {
      addressDeliveryIds,
    };



    return await MemberModel.findByIdAndUpdate(
      member.id,
      { $set: params },
      { new: true }
    );
  },
};

export default {
  Mutation,
};
