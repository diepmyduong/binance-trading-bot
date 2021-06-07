import dynamic from "next/dynamic";
import { Card } from "../../shared/utilities/card/card";
import { Spinner } from "../../shared/utilities/spinner";

const BasicStatistics = dynamic<any>(() =>
  import("./components/basic-statistics").then((mod) => mod.BasicStatistics)
);
const ChartMember = dynamic<any>(
  () => import("./components/chart-member").then((mod) => mod.ChartMember),
  { loading: ({ isLoading }) => isLoading && <Spinner /> }
);
const ChartPoint = dynamic<any>(
  () => import("./components/chart-point").then((mod) => mod.ChartPoint),
  { loading: ({ isLoading }) => isLoading && <Spinner /> }
);
export function ManagerPage() {
  return (
    <>
      <div className="grid grid-cols-2 gap-4 max-w-6xl">
        <div className="col-span-2">
          <Card>
            <BasicStatistics />
          </Card>
        </div>
        <div className="col">
          <Card>
            <ChartMember></ChartMember>
          </Card>
        </div>
        <div className="col">
          <Card>
            <ChartPoint></ChartPoint>
          </Card>
        </div>
      </div>
    </>
  );
}
