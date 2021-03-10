import { set } from "lodash";
import { ROLES } from "../../../../constants/role.const";
import { AuthHelper } from "../../../../helpers";
import { Context } from "../../../context";
import { MemberModel, MemberType } from "../member.model";
import { memberService } from "../member.service";

const Query = {
  getAllPosts: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.MEMBER]);

    set(args, "q.filter.type", MemberType.BRANCH);
    // set(args, "q.filter.type", MemberType.BRANCH);

    return memberService.fetch(args.q);
  },
};

export default {
  Query,
};
