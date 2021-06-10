import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { CardHeader } from "./card-header";
export function ChartPoint() {
  const [ChartData, setChartData] = useState({
    labels: ["T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11"],
    position: "bottom",
    align: "left",
    datasets: [
      {
        label: "Số lượng báo giá",
        data: [750, 555, 250, 450, 250, 480, 555, 762, 360, 688],
        backgroundColor: "rgb(231, 77, 61,1)",
        borderColor: "rgb(231, 77, 61,1)",
        borderWidth: 1,
        barThickness: 5,
        radius: 5,
      },
    ],
  });
  useEffect(() => {}, []);
  return (
    <>
      <div className="wrapper">
        <CardHeader
          title="Tăng trưởng báo giá"
          subtitle="Thống kê số liệu báo giá theo từng tháng"
          tooltip="Thống kê số liệu báo giá theo từng tháng"
        />

        <div className="chart">
          <div className="container-chart">
            {ChartData && (
              <Bar
                height={150}
                width={300}
                data={ChartData}
                options={{
                  responsive: true,
                  legend: { position: "bottom", align: "left" },
                  scales: { xAxes: [{ stacked: true }], yAxes: [{ stacked: true }] },
                }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
