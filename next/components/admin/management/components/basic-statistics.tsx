import { format } from "date-fns";
import { useEffect, useState } from "react";

import { CardHeader } from "./card-header";

export function BasicStatistics(props) {
  const [OverviewData, setOverviewData] = useState(statistic_data);
  return (
    <div className="wrapper">
      <div className="">
        <CardHeader
          title="Thống kê số liệu tổng quát"
          subtitle={`Dữ liệu tổng quan hôm nay ${format(new Date(), "HH:mm")}`}
          tooltip="Thống kê số liệu tổng quát từng tháng"
        />
        <div className="container-statistics p-4 grid grid-cols-4 gap-4">
          {OverviewData.map((item, index) => {
            return (
              <div key={index} className="item-statistic p-2 hover:shadow col">
                <div className="infor text-center">
                  <div className="title">
                    <p className="">{item.title}</p>
                  </div>
                  <div className="data-infor pt-2 text-primary-dark">
                    <p className="text-3xl text-primary font-bold">{item.data}</p>
                    <p className=" text-primary text-sm">{item.unit}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export const statistic_data = [
  {
    title: "Tổng số",
    data: "236",
    unit: "sự kiện",
    growth: 100,
  },
  {
    title: "Tổng số khách hàng",
    data: "105",
    unit: "khách hàng",
    growth: 100,
  },
  {
    title: "Tổng giá trị giao dịch",
    data: "79.948.100",
    unit: "đồng",
    growth: 50,
  },
  {
    title: "Tăng trưởng",
    data: "90%",
    unit: "",
    growth: -10,
  },
];
