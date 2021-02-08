import { get } from "lodash";
import { CustomerModel } from "../../../graphql/modules/customer/customer.model";
import { MemberModel, MemberType } from "../../../graphql/modules/member/member.model";
import { OrderModel } from "../../../graphql/modules/order/order.model";
import { ProductModel, ProductType } from "../../../graphql/modules/product/product.model";
import { Chart } from "../chart";
import { TableChart } from "../charts/table.chart";
import { WidgetChart } from "../charts/widget.chart";
import { Report } from "../report";

class OverviewReport extends Report<any> {
  code: string = "OverviewReport";
  title: string = "Báo cáo tổng quan";
  requireFilter: boolean = false;
  filters: any[] = [];
  cacheEnabled: boolean = false;
  hidden: boolean = true;
  async query(filter: any, paging?: any): Promise<Chart[]> {
    const charts: Chart[] = [];
    const memberStats = await MemberModel.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          branch: { $sum: { $cond: [{ $eq: ["$type", MemberType.BRANCH] }, 1, 0] } },
          sale: { $sum: { $cond: [{ $eq: ["$type", MemberType.SALE] }, 1, 0] } },
          agency: { $sum: { $cond: [{ $eq: ["$type", MemberType.AGENCY] }, 1, 0] } },
        },
      },
    ]).then((res) => get(res, "0", {}));
    charts.push(
      new WidgetChart({ title: "Chủ shop", unit: "", data: get(memberStats, "total", 0) })
    );
    charts.push(
      new WidgetChart({ title: "Chi nhánh", unit: "", data: get(memberStats, "branch", 0) })
    );
    charts.push(new WidgetChart({ title: "Sale", unit: "", data: get(memberStats, "sale", 0) }));
    charts.push(
      new WidgetChart({ title: "Đại lý", unit: "", data: get(memberStats, "agency", 0) })
    );
    const customerStats = await CustomerModel.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
        },
      },
    ]).then((res) => get(res, "0", {}));
    charts.push(
      new WidgetChart({ title: "Khách hàng", unit: "", data: get(customerStats, "total", 0) })
    );
    const productStats = await ProductModel.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          isPrimary: { $sum: { $cond: [{ $eq: ["$isPrimary", true] }, 1, 0] } },
          isCross: { $sum: { $cond: [{ $eq: ["$isCross", true] }, 1, 0] } },
          retail: { $sum: { $cond: [{ $eq: ["$type", ProductType.RETAIL] }, 1, 0] } },
          service: { $sum: { $cond: [{ $eq: ["$type", ProductType.SERVICE] }, 1, 0] } },
          sms: { $sum: { $cond: [{ $eq: ["$type", ProductType.SMS] }, 1, 0] } },
        },
      },
    ]).then((res) => get(res, "0", {}));
    charts.push(
      new TableChart({
        title: "Sản phẩm",
        colLabels: ["Loại", "Số lượng"],
        colValues: [
          ["Mobifone", get(productStats, "isPrimary", 0)],
          ["Bán chéo", get(productStats, "isCross", 0)],
          ["Bán lẻ", get(productStats, "retail", 0)],
          ["SMS", get(productStats, "sms", 0)],
          ["Dịch vụ khác", get(productStats, "service", 0)],
        ],
        total: 10,
        offset: 1,
        limit: 20,
      })
    );
    return charts;
  }
}

export default new OverviewReport();
