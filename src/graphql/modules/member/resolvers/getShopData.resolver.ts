import { set } from "lodash";
import { ROLES } from "../../../../constants/role.const";
import { AuthHelper, ErrorHelper, firebaseHelper, UtilsHelper } from "../../../../helpers";
import { GraphQLHelper } from "../../../../helpers/graphql.helper";
import { Context } from "../../../context";
import { AddressDeliveryLoader, AddressDeliveryModel } from "../../addressDelivery/addressDelivery.model";
import { AddressStorehouseLoader } from "../../addressStorehouse/addressStorehouse.model";
import { IMember, MemberType } from "../member.model";
import { memberService } from "../member.service";

const Query = {
  getShopData: async (root: any, args: any, context: Context) => {
    
    const { pageId, memberCode } = context;

    const params: any = {};

    if (memberCode) {
      params.code = memberCode;
    }
    else{
      params.fanpageId = pageId;
    }
    
    return memberService.findOne(params);
  },
};

const Shop = {
  addressDelivery: async (root: IMember, args: any, context: Context) => {
    const address = await AddressDeliveryModel.findOne({ code: root.code });
    if (!address) return null;
    const noExistedAddress = root.addressDeliveryIds.findIndex(addr => addr.toString() === address.id) === -1;
    if (noExistedAddress) return null;
    return address;
  },

  mainAddressStorehouse: GraphQLHelper.loadById(
    AddressStorehouseLoader,
    "mainAddressStorehouseId"
  ),
  addressStorehouses: GraphQLHelper.loadManyById(
    AddressStorehouseLoader,
    "addressStorehouseIds"
  ),
  addressDeliverys: GraphQLHelper.loadManyById(
    AddressDeliveryLoader,
    "addressDeliveryIds"
  ),
}
export default {
  Query,
  Shop
};
