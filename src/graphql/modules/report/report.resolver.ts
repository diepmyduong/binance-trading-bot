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
};

export default {
  Query,
};
