import { set } from "lodash";
import { ROLES } from "../../../../constants/role.const";
import { AuthHelper, ErrorHelper, firebaseHelper, UtilsHelper } from "../../../../helpers";
import { GraphQLHelper } from "../../../../helpers/graphql.helper";
import { Context } from "../../../context";
import { MemberType } from "../member.model";
import { memberService } from "../member.service";

const Query = {
  getShopData: async (root: any, args: any, context: Context) => {
    const { pageId } = context;
    return memberService.findOne({ fanpageId: pageId });
  },
};

export default {
  Query,
};
