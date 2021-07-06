import { ErrorHelper } from "../../../../base/error";
import { ROLES } from "../../../../constants/role.const";
import { GraphQLHelper } from "../../../../helpers/graphql.helper";
import { Context } from "../../../context";
import {
  AddressDeliveryLoader,
  AddressDeliveryModel,
} from "../../addressDelivery/addressDelivery.model";
import { AddressStorehouseLoader } from "../../addressStorehouse/addressStorehouse.model";
import { ShopConfigModel } from "../../shopConfig/shopConfig.model";
import { IMember, MemberModel } from "../member.model";
import { memberService } from "../member.service";

const Query = {
  getShopData: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ANONYMOUS_CUSTOMER_MEMBER_STAFF);
    return MemberModel.findById(context.sellerId);
  },
};

const Shop = {
  addressDelivery: async (root: IMember, args: any, context: Context) => {
    const address = await AddressDeliveryModel.findOne({ code: root.code });
    if (!address) return null;
    const noExistedAddress =
      root.addressDeliveryIds.findIndex((addr) => addr.toString() === address.id) === -1;
    if (noExistedAddress) return null;
    return address;
  },

  mainAddressStorehouse: GraphQLHelper.loadById(AddressStorehouseLoader, "mainAddressStorehouseId"),
  addressStorehouses: GraphQLHelper.loadManyById(AddressStorehouseLoader, "addressStorehouseIds"),
  addressDeliverys: GraphQLHelper.loadManyById(AddressDeliveryLoader, "addressDeliveryIds"),
  config: async (root: IMember, args: any, context: Context) => {
    return await ShopConfigModel.findOne({ memberId: root._id });
  },
};
export default {
  Query,
  Shop,
};
