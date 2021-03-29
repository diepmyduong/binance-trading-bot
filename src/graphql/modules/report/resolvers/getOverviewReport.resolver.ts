import { ROLES } from "../../../../constants/role.const";
import { AuthHelper, ErrorHelper } from "../../../../helpers";
import { Context } from "../../../context";
import { ReportHelper } from "../report.helper";

const Query = {
  getOverviewReport: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
    const result = await ReportHelper.getReport("OverviewReport");
    if (!result) throw ErrorHelper.somethingWentWrong("Report OverviewReport Missing");
    const json = (await result.fetchData()).toJSON();
    return json;
  },
};

export default { Query };
