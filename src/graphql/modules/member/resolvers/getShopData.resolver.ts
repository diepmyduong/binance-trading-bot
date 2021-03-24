import { set } from "lodash";
import { ROLES } from "../../../../constants/role.const";
import { AuthHelper, ErrorHelper, firebaseHelper, UtilsHelper } from "../../../../helpers";
import { GraphQLHelper } from "../../../../helpers/graphql.helper";
import { Context } from "../../../context";
import { MemberType } from "../member.model";
import { memberService } from "../member.service";

const Query = {
  getShopData: async (root: any, args: any, context: Context) => {
    const { pageId , memberCode } = context;
    const params:any = {};
    if(pageId){
      params.fanpageId = pageId;
    }
    if(memberCode){
      params.code = memberCode;
    }
    return memberService.findOne(params);
  },
};

export default {
  Query,
};
