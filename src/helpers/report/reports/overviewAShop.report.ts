import { MemberModel } from "../../../graphql/modules/member/member.model";
import { Chart } from "../chart";
import { WidgetChart } from "../charts/widget.chart";
import { Report } from "../report";

class OverviewAShopReport extends Report<any> {
  code: string = "OverviewAShopReport";
  title: string = "Tổng quan cửa hàng A Sho ";
  requireFilter: boolean = false;
  filters: any[] = [];
  cacheEnabled: boolean = false;
  hidden: boolean = true;
  async query(filter: any, paging?: any): Promise<Chart[]> {
    const charts: Chart[] = [];
    const { memberId } = filter;
    const member = await MemberModel.findById(memberId);
    charts.push(
      new WidgetChart({
        title: "Điểm tích luỹ",
        unit: "Điểm",
        data: parseFloat(member.cumulativePoint.toFixed(2)),
      })
    );
    charts.push(
      new WidgetChart({
        title: "Hoa hồng",
        unit: "VNĐ",
        data: parseFloat(member.commission.toFixed(2)),
      })
    );
    return charts;
  }
}

export default new OverviewAShopReport();
