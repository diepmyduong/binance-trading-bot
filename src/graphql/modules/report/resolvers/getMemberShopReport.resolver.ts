import { ErrorHelper } from "../../../../base/error";
import { ROLES } from "../../../../constants/role.const";
import { AuthHelper } from "../../../../helpers/auth.helper";
import { Context } from "../../../context";
import { ReportHelper } from "../report.helper";

const Query = {
  getMemberShopReport: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
    const { memberId } = args;
    if (context.tokenData.role == ROLES.MEMBER && memberId != context.tokenData._id) {
      throw ErrorHelper.permissionDeny();
    }
    const result = await ReportHelper.getReport("OverviewAShopReport");
    if (!result) throw ErrorHelper.somethingWentWrong("Report OverviewAShopReport Missing");
    const json = (await result.fetchData({ memberId })).toJSON();
    return json;
  },
};

export default { Query };
