import cloneDeep from "lodash/cloneDeep";
import { createContext, useContext, useEffect, useState } from "react";
import { useShopContext } from "../../../../lib/providers/shop-provider";
import { useToast } from "../../../../lib/providers/toast-provider";
import { ReportService } from "../../../../lib/repo/report.repo";

type shopOrderType = {
  pending: number;
  confirmed: number;
  delivering: number;
  completed: number;
  canceled: number;
  failure: number;
  total: number;
  pendingRevenue: number;
  revenue: number;
};

export const DashboardContext = createContext<
  Partial<{
    top10Products: {
      productId: string;
      qty: number;
      productName: string;
    }[];
    shopOrderReport: shopOrderType;
    shopOrderReportToday: shopOrderType;
    loadReportProduct: (fromDate: string, toDate: string) => Promise<any>;
    loadReportShopOrder: (fromDate: string, toDate: string) => Promise<any>;
    loadReportChart: (fromDate: string, toDate: string) => Promise<any>;
    loadReportShopCustomer: () => Promise<any>;
    getDate: (data: string) => { fromDate: string; toDate: string };
    shopCustomerReport: number;
    dataChart: any;
  }>
>({});
export function DashboardProvider(props) {
  const toast = useToast();
  const { branchSelecting } = useShopContext();
  const [shopCustomerReport, setShopCustomerReport] = useState<number>(0);
  const [dataChart, setDataChart] = useState<any>();
  const [shopOrderReportToday, setShopOrderReportToday] = useState<shopOrderType>({
    pending: 0,
    confirmed: 0,
    delivering: 0,
    completed: 0,
    canceled: 0,
    failure: 0,
    total: 0,
    pendingRevenue: 0,
    revenue: 0,
  });
  const [top10Products, setTop10Products] = useState<
    {
      productId: string;
      qty: number;
      productName: string;
    }[]
  >([]);
  const [shopOrderReport, setShopOrderReport] = useState<shopOrderType>({
    pending: 0,
    confirmed: 0,
    delivering: 0,
    completed: 0,
    canceled: 0,
    failure: 0,
    total: 0,
    pendingRevenue: 0,
    revenue: 0,
  });

  const getDate = (data: string) => {
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString();
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString();
    switch (data) {
      case "Tháng này":
        firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString();
        lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString();
        break;
      case "Tháng trước":
        firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1).toISOString();
        lastDay = new Date(date.getFullYear(), date.getMonth(), 0).toISOString();
        break;
      case "3 tháng gần nhất":
        firstDay = new Date(date.getFullYear(), date.getMonth() - 3, 1).toISOString();
        lastDay = new Date(date.getFullYear(), date.getMonth(), 0).toISOString();
        break;
    }
    return { fromDate: firstDay, toDate: lastDay };
  };
  useEffect(() => {
    let today = new Date().toISOString();
    ReportService.reportShopOrder(today, today).then((res) => setShopOrderReportToday(res));
  }, []);
  const loadReportChart = (fromDate: string, toDate: string) => {
    return ReportService.reportShopOrderKline(fromDate, toDate).then((res) => setDataChart(res));
  };
  const loadReportShopCustomer = () => {
    return ReportService.reportShopCustomer().then((res) => setShopCustomerReport(res.total));
  };
  const loadReportShopOrder = (fromDate: string, toDate: string) => {
    return ReportService.reportShopOrder(fromDate, toDate).then((res) => setShopOrderReport(res));
  };
  const loadReportProduct = (fromDate: string, toDate: string) => {
    return ReportService.reportShopProduct(fromDate, toDate).then((res) =>
      setTop10Products(res.top10)
    );
  };
  return (
    <DashboardContext.Provider
      value={{
        loadReportProduct,
        top10Products,
        getDate,
        loadReportShopOrder,
        shopCustomerReport,
        shopOrderReport,
        loadReportShopCustomer,
        shopOrderReportToday,
        dataChart,
        loadReportChart,
      }}
    >
      {props.children}
    </DashboardContext.Provider>
  );
}

export const useDashboardContext = () => useContext(DashboardContext);
