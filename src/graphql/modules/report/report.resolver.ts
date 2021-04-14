import { ErrorHelper } from "../../../base/error";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { Context } from "../../context";
import { ReportHelper } from "./report.helper";

const Query = {
  getAllReportCode: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
    return ReportHelper.getReportCodes();
  },
  getReportData: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
    const { code, option } = args;
    const result = await ReportHelper.getReport(code);
    if (!result) {
      throw ErrorHelper.requestDataInvalid(`Không có báo cáo theo code: ${code}`);
    }
    const json = (await result.fetchData(option)).toJSON();
    return json;
  },
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
  getOverviewReport: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
    const result = await ReportHelper.getReport("OverviewReport");
    if (!result) throw ErrorHelper.somethingWentWrong("Report OverviewReport Missing");
    const json = (await result.fetchData()).toJSON();
    return json;
  },
};

export default {
  Query,
};
