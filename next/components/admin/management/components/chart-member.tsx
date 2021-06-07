import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { CardHeader } from "./card-header";
export function ChartMember() {
  const [ChartData, setChartData] = useState({
    labels: ["T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11"],
    position: "bottom",
    align: "left",
    datasets: [
      {
        label: "Doanh số",
        data: [750, 555, 250, 450, 250, 480, 555, 762, 360, 688],
        backgroundColor: ["rgba(255, 99, 132, 0.0)"],
        borderColor: ["rgb(231, 77, 61,1)"],
        borderWidth: 2,
      },
    ],
  });
  useEffect(() => {}, []);
  return (
    <>
      <div className="wrapper">
        <CardHeader
          title="Tăng trưởng theo doanh số"
          subtitle="Biểu đồ tăng trưởng doanh số từng tháng tính tới hiện tại"
          tooltip="Biểu đồ tăng trưởng doanh số từng tháng tính tới hiện tại"
        />
        <div className="chart">
          <div className="container-chart">
            {ChartData && (
              <Line
                height={150}
                width={300}
                data={ChartData}
                options={{
                  responsive: true,
                  legend: {
                    position: "bottom",
                    align: "left",
                  },
                }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
