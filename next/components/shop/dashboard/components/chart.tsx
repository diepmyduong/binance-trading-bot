import { useEffect, useMemo, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import { useDashboardContext } from "../provider/dashboard-privder";

export function Chart(props) {
  const { selectedTime } = props;
  const { dataChart, loadReportChart, getDate } = useDashboardContext();

  const labels = [],
    data = [0, 20, 20, 60, 60, 120, 12, 180, 120, 125, 105, 110, 170];
  for (let i = 0; i < 12; ++i) {
    labels.push(i.toString());
  }
  let [lineChartData, setLineChartData] = useState({
    align: "left",
    datasets: [
      {
        data: data,
        borderColor: ["rgba(13, 87, 239)"],
        borderWidth: 2,
        backgroundColor: "rgba(13, 87, 239, 0.0)",
        label: "Tăng trưởng",
      },
    ],
    labels: labels,
  });
  const [barChartData, setBarChartData] = useState({
    align: "left",
    datasets: [
      {
        data: data,
        backgroundColor: ["rgba(13, 87, 239, 1)"],
        borderColor: ["rgba(13, 87, 239, 1)"],
        borderWidth: 2,
        label: "Tăng trưởng",
      },
    ],
    labels: labels,
  });
  useEffect(() => {
    if (dataChart?.datasets) {
      setLineChartData({
        ...lineChartData,
        datasets: [
          {
            data: [...dataChart.datasets[1].data],
            borderColor: ["rgba(13, 87, 239)"],
            borderWidth: 2,
            backgroundColor: "rgba(13, 87, 239, 0.0)",
            label: dataChart.datasets[1].label,
          },
        ],
        labels: dataChart.labels,
      });
      setBarChartData({
        ...barChartData,
        datasets: [
          {
            data: [...dataChart.datasets[0].data],
            backgroundColor: ["rgba(13, 87, 239, 1)"],
            borderColor: ["rgba(13, 87, 239, 1)"],
            borderWidth: 2,
            label: dataChart.datasets[0].label,
          },
        ],
        labels: dataChart.labels,
      });
    }
  }, [dataChart]);
  useEffect(() => {
    let date = getDate(selectedTime);
    loadReportChart(date.fromDate, date.toDate);
  }, [selectedTime]);
  return useMemo(
    () => (
      <>
        <div className="grid grid-cols-2">
          {lineChartData && (
            <div className="">
              <Line
                height={100}
                width={200}
                data={lineChartData}
                options={{
                  responsive: true,
                  legend: {
                    position: "bottom",
                    align: "left",
                  },
                }}
              />
            </div>
          )}
          {barChartData && (
            <div className="">
              <Bar
                height={100}
                width={200}
                data={barChartData}
                options={{
                  responsive: true,
                  legend: { position: "bottom", align: "left" },
                  scales: { xAxes: [{ stacked: true }], yAxes: [{ stacked: true }] },
                }}
              />
            </div>
          )}
        </div>
      </>
    ),
    [lineChartData, barChartData]
  );
}
