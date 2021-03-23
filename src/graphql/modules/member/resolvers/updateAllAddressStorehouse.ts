import { ROLES } from "../../../../constants/role.const";
import { AuthHelper } from "../../../../helpers";
import { Context } from "../../../context";
import { MemberModel } from "../member.model";
import { AddressDeliveryModel } from "../../addressDelivery/addressDelivery.model";
import { AddressStorehouseModel } from "../../addressStorehouse/addressStorehouse.model";
import { ErrorHelper } from "../../../../base/error";

const Mutation = {
  updateAllAddressStorehouse: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.MEMBER]);

    const { id } = args;

    const member = await MemberModel.findById(id);
    if (!member) throw ErrorHelper.requestDataInvalid("mã nhân viên");

    const addressStorehouses = await AddressStorehouseModel.find({
      isPost: true,
    });

    const addressStorehouseIds:any[] = addressStorehouses.map((id) => id);
    

    for (const id of member.addressStorehouseIds) {
        if(!addressStorehouseIds.find(addrId => addrId === id.toString())){
          addressStorehouseIds.push(id);
        }
    }

    const params: any = {
      addressStorehouseIds: addressStorehouses.map((id) => id),
    };

    const mainAddressStorehouseId = addressStorehouses.find(
      (addr) => addr.code === member.code
    );

    params.mainAddressStorehouseId = mainAddressStorehouseId;

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
