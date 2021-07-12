import dynamic from "next/dynamic";
import { NumberPipe } from "../../../../lib/pipes/number";
import { Card } from "../../../shared/utilities/card/card";
import { Button } from "../../../shared/utilities/form/button";
import { Label } from "../../../shared/utilities/form/label";
import { Spinner } from "../../../shared/utilities/spinner";
import { CardCustom } from "./card-custom";

const Chart = dynamic<any>(() => import("./chart").then((mod) => mod.Chart), {
  loading: ({ isLoading }) => isLoading && <Spinner />,
});
export function Dashboard() {
  return (
    <div className="w-full text-gray-800">
      <ActivedEmail />
      <BusinessStepByStep />
      <ChartBusiness />
    </div>
  );
}
const ChartBusiness = () => {
  return (
    <div className="mt-4">
      <div className="py-4">
        <h1 className="text-primary text-lg">Tình trạng kinh doanh</h1>
      </div>
      <CardCustom>
        <CardCustom.Header
          title="Doanh thu"
          filter={[
            { value: "3 tháng gần nhất", label: "3 tháng gần nhất" },
            { value: "Tháng này", label: "Tháng này" },
            { value: "Tháng trước", label: "Tháng trước" },
          ]}
        />
        <CardCustom.Body>
          <Chart />
        </CardCustom.Body>
      </CardCustom>
      <div className="mt-4 grid grid-cols-5">
        <div className="flex flex-col col-span-2 space-y-4">
          <Card className="min-w-sm">
            <div className="text-sm">Tổng đơn hàng</div>
            <div className="font-bold text-2xl">8</div>
          </Card>
          <Card className="min-w-sm">
            <div className="text-sm">Doanh thu bán hàng</div>
            <div className="font-bold text-2xl">{NumberPipe(948000)}đ</div>
          </Card>
          <Card className="min-w-sm">
            <div className="text-sm">Trung bình mỗi đơn</div>
            <div className="font-bold text-2xl">{NumberPipe(65000)}đ</div>
          </Card>
          <Card className="min-w-sm">
            <div className="text-sm">Tổng giảm giá</div>
            <div className="font-bold text-2xl">{NumberPipe(78000)}đ</div>
          </Card>
          <Card className="min-w-sm">
            <div className="text-sm">Doanh số ship</div>
            <div className="font-bold text-2xl">{NumberPipe(365000)}đ</div>
            <div className="text-sm font-bold text-primary">
              Lợi nhuận ship {" " + NumberPipe(365000)}đ
            </div>
          </Card>
        </div>
        <div className="h-full w-full  pl-4 col-span-3 overflow-auto">
          <CardCustom className=" w-full ">
            <CardCustom.Header
              title="Sản phẩm bán chạy"
              filter={[
                { value: "3 tháng gần nhất", label: "3 tháng gần nhất" },
                { value: "Tháng này", label: "Tháng này" },
                { value: "Tháng trước", label: "Tháng trước" },
              ]}
            />
            <CardCustom.Body style={{ padding: 0 }} className="overflow-auto">
              <div className="grid grid-cols-2 bg-gradient sticky top-0 shadow-md p-4 text-white">
                <div className="">Tên sản phẩm</div>
                <div className="">Số lượng</div>
              </div>
              {DataProduct.map((item, ind) => {
                let backgroundGray = ind % 2 == 1 && " bg-gray-100 ";
                return (
                  <div className={`grid grid-cols-2 p-4 ${backgroundGray}`}>
                    <div className="">{item.name}</div>
                    <div className="">{item.amount}</div>
                  </div>
                );
              })}
            </CardCustom.Body>
          </CardCustom>
        </div>
      </div>
    </div>
  );
};
const DataProduct = [
  { name: "Sản phẩm 1", amount: 234 },
  { name: "Sản phẩm 2", amount: 123 },
  { name: "Sản phẩm 3", amount: 3442 },
  { name: "Sản phẩm 4", amount: 642 },
  { name: "Sản phẩm 5", amount: 622 },
  { name: "Sản phẩm 6", amount: 412 },
  { name: "Sản phẩm 7", amount: 543 },
  { name: "Sản phẩm 8", amount: 436 },
];

const BusinessStepByStep = () => {
  const step = [
    "Xem nhà hàng số của bạn",
    "Tải bahana để nhận hàng",
    "Đặt thử nghiệm đơn hàng",
    "Xử lý đơn hàng & đặt ship",
  ];
  return (
    <div className="mt-4">
      <div className="py-4">
        <h1 className="text-primary text-lg">Từng bước kinh doanh online</h1>
      </div>
      <CardCustom>
        <CardCustom.Header title="Thử đặt đơn hàng đầu tiên" />
        <CardCustom.Body>
          {step.map((item, index) => {
            let first = index == 0;
            return (
              <div
                className={`flex items-center cursor-pointer text-sm px-2 ${!first && "pt-6"}`}
                key={index}
              >
                <div className="w-5 h-5 text-white flex items-center justify-center rounded-full bg-gradient">
                  {index + 1}
                </div>
                <div className="ml-2">{item}</div>
              </div>
            );
          })}
        </CardCustom.Body>
      </CardCustom>
      <div className="mt-4 flex">
        <CardCustom className="min-w-max">
          <CardCustom.Header title="Tổng số thiết bị bahana hoạt động"></CardCustom.Header>
          <CardCustom.Body>
            <div className="flex items-end">
              <div className="text-6xl">2</div>
              <div className="ml-2 text-sm pb-1">thiết bị</div>
            </div>
          </CardCustom.Body>
        </CardCustom>
        <CardCustom className="ml-4 w-full">
          <CardCustom.Header title="nhahang.so"></CardCustom.Header>
          <CardCustom.Body>
            <div className="grid grid-cols-2 divide-x">
              <div className="flex items-end pr-4">
                <div className="text-6xl">0/10</div>
                <div className="ml-2 text-sm pb-1">đơn hàng mỗi ngày</div>
              </div>
              <div className="flex items-end pl-4">
                <div className="text-6xl">6</div>
                <div className="ml-2 text-sm pb-1">đơn hàng chưa hoàn tất</div>
              </div>
            </div>
          </CardCustom.Body>
        </CardCustom>
      </div>
    </div>
  );
};
const ActivedEmail = () => {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="">
          <Label text="Chưa kích hoạt tài khoản email" />
          <div className="text-xs flex px-1">
            <p className="text-gray-400">Nhận đường dẫn kích hoạt qua email </p>
            <p className="ml-1 font-semibold text-gray-600"> lehuuthong8873@gmail.com</p>
          </div>
        </div>
        <Button text="Kích hoạt ngay" primary className="bg-gradient" />
      </div>
    </Card>
  );
};
