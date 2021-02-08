import _ from "lodash";
import path from "path";
import { ListReports, Report } from "../../../helpers/report/report";
import { UtilsHelper } from "../../../helpers/utils.helper";

export class ReportHelper {
  constructor() {}

  static getReportCodes() {
    return _.chain(ListReports)
      .filter((r) => !r.hidden)
      .orderBy(["priority"])
      .reverse()
      .map((r) => ({
        code: r.code,
        title: r.title,
        requireFilter: r.requireFilter,
        filters: r.filters,
      }))
      .value();
  }

  static getReport(code: string) {
    return ListReports.find((r) => r.code == code);
  }
}

export const reportHelper = new ReportHelper();
