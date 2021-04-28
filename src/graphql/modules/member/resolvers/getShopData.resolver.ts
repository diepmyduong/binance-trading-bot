import { ErrorHelper } from "../../../../base/error";
import { GraphQLHelper } from "../../../../helpers/graphql.helper";
import { Context } from "../../../context";
import { AddressDeliveryLoader, AddressDeliveryModel } from "../../addressDelivery/addressDelivery.model";
import { AddressStorehouseLoader } from "../../addressStorehouse/addressStorehouse.model";
import { IMember, MemberModel } from "../member.model";
import { memberService } from "../member.service";

const Query = {
  getShopData: async (root: any, args: any, context: Context) => {
    const { pageId, memberCode, xPageId , xPsId} = context;


    const params: any = {};

    if (!pageId && !xPageId && !memberCode)
      throw ErrorHelper.requestDataInvalid("Lỗi pageId");

    // console.log('pageId', pageId);
    // console.log('xPageId', xPageId);
    // console.log('memberCode', memberCode);
    console.log('xPsId',xPsId);

    if (pageId) {
      params.fanpageId = pageId;
    }
    else if (xPageId) {
      params.fanpageId = xPageId;
    }
    else {
      if (memberCode) {
        params.code = memberCode;
      }
    }

    // console.log('params', params);

    const member = await memberService.findOne(params);

    if (!member)
      throw ErrorHelper.mgRecoredNotFound("Bưu cục");
  
    if(xPsId){
      await MemberModel.findByIdAndUpdate(member.id, {$addToSet:{ psids: xPsId }} )
    }

    return member;
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
