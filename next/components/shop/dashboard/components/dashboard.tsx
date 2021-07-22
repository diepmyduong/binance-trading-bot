import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { NumberPipe } from "../../../../lib/pipes/number";
import { Card } from "../../../shared/utilities/card/card";
import { Button } from "../../../shared/utilities/form/button";
import { Label } from "../../../shared/utilities/form/label";
import { NotFound } from "../../../shared/utilities/not-found";
import { Spinner } from "../../../shared/utilities/spinner";
import { useDashboardContext } from "../provider/dashboard-privder";
import { CardCustom } from "./card-custom";

const Chart = dynamic<any>(() => import("./chart").then((mod) => mod.Chart), {
  loading: ({ isLoading }) => isLoading && <Spinner />,
});
export function Dashboard() {
  return (
    <div className="w-full text-gray-800">
      {/* <ActivedEmail /> */}
      <BusinessStepByStep />
      <ChartBusiness />
      <ReportProductOrder />
    </div>
  );
}

function TableProduct(props) {
  return (
    <CardCustom className=" w-full ">
      <CardCustom.Header
        title="Sản phẩm bán chạy"
        filter={[
          {
            value: "Tháng này",
            label: "Tháng này",
          },
          {
            value: "Tháng trước",
            label: "Tháng trước",
          },
          {
            value: "3 tháng gần nhất",
            label: "3 tháng gần nhất",
          },
        ]}
        onChange={(data) => props.setFilterReportProduct(data)}
      />
      <CardCustom.Body
        style={{
          padding: 0,
        }}
        className=""
      >
        <div className="grid grid-cols-2 bg-gradient sticky top-0 border-b-2 border border-gray-200 shadow-lg p-4 font-semibold text-white">
          <div className="text-center">Tên sản phẩm</div>
          <div className="text-center">Số lượng</div>
        </div>
        <div
          className=" overflow-auto"
          style={{
            height: "372px",
          }}
        >
          {!props.top10Products ? (
            <Spinner />
          ) : props.top10Products.length == 0 ? (
            <NotFound text="Không có sản phẩm nào" />
          ) : (
            props.top10Products.map((item, ind) => {
              let backgroundGray = ind % 2 == 1 && " bg-gray-200 ";
              return (
                <div key={ind} className={`grid grid-cols-2 p-4 ${backgroundGray}`}>
                  <div className="text-center">{item.productName}</div>
                  <div className="text-center">{item.qty}</div>
                </div>
              );
            })
          )}
        </div>
      </CardCustom.Body>
    </CardCustom>
  );
}

function TableVoucher(props) {
  const { top10Vouchers } = useDashboardContext();
  console.log("top10Vouchers", top10Vouchers);
  return (
    <CardCustom className={` w-full ${props.className}`}>
      <CardCustom.Header title="Top 10 voucher được sử dụng nhiều nhất" />
      <CardCustom.Body
        style={{
          padding: 0,
        }}
        className=""
      >
        <div className="grid grid-cols-3 bg-gradient sticky top-0 border-b-2 border border-gray-200 shadow-lg p-4 font-semibold text-white">
          <div className="text-center">Mã Voucher</div>
          <div className="text-center">Mô tả</div>
          <div className="text-center">Số lượng sử dụng</div>
        </div>
        <div
          className=" overflow-auto"
          style={{
            height: "372px",
          }}
        >
          {!top10Vouchers ? (
            <Spinner />
          ) : top10Vouchers.length == 0 ? (
            <NotFound text="Không có voucher nào" />
          ) : (
            top10Vouchers.map((item, ind) => {
              let backgroundGray = ind % 2 == 1 && " bg-gray-200 ";
              return (
                <div key={ind} className={`grid grid-cols-3 p-4 ${backgroundGray}`}>
                  <div className="text-center">{item.voucher.code}</div>
                  <div className="text-center">{item.voucher.description}</div>
                  <div className="text-center">{item.qty}</div>
                </div>
              );
            })
          )}
        </div>
      </CardCustom.Body>
    </CardCustom>
  );
}

function ReportProductOrder(props) {
  const {
    loadReportProduct,
    top10Products,
    getDate,
    loadReportShopOrder,
    shopOrderReport,
  } = useDashboardContext();
  const [filterReportProduct, setFilterReportProduct] = useState("Tháng này");
  useEffect(() => {
    let date = getDate(filterReportProduct);
    loadReportProduct(date.fromDate, date.toDate);
  }, [filterReportProduct]);
  useEffect(() => {
    let date = getDate("Tháng này");
    loadReportShopOrder(date.fromDate, date.toDate);
  }, []);
  return (
    <div className="mt-4">
      <div className="grid grid-cols-3 items-center">
        <Card className="mt-2 mr-2">
          <div className="text-sm">Tổng đơn hàng</div>
          <div className="font-bold text-2xl">{shopOrderReport?.completed}</div>
        </Card>
        <Card className="mt-2 mr-2">
          <div className="text-sm">Doanh thu bán hàng</div>
          <div className="font-bold text-2xl">{NumberPipe(shopOrderReport?.revenue)}đ</div>
        </Card>
        <Card className="mt-2 mr-2">
          <div className="text-sm">Trung bình mỗi đơn</div>
          <div className="font-bold text-2xl">
            {NumberPipe(Math.floor(shopOrderReport?.revenue / shopOrderReport?.completed))}đ
          </div>
        </Card>
        <Card className="mt-2 mr-2">
          <div className="text-sm">Tổng giảm giá</div>
          <div className="font-bold text-2xl">{NumberPipe(shopOrderReport?.discount)}đ</div>
        </Card>
        <Card className="mt-2 mr-2">
          <div className="text-sm">Doanh số ship</div>
          <div className="flex items-end">
            <div className="font-bold text-2xl">{NumberPipe(shopOrderReport?.partnerShipfee)}đ</div>
            <div className="text-sm font-bold text-primary ml-2 pb-1">
              Lợi nhuận ship {" " + NumberPipe(shopOrderReport?.shipfee)}đ
            </div>
          </div>
        </Card>
      </div>
      <div className="h-full w-full mt-4 flex items-center">
        <TableProduct
          top10Products={top10Products}
          setFilterReportProduct={setFilterReportProduct}
        ></TableProduct>
        <TableVoucher
          className="ml-2"
          top10Products={top10Products}
          setFilterReportProduct={setFilterReportProduct}
        ></TableVoucher>
      </div>
    </div>
  );
}

const ChartBusiness = () => {
  const [selectedTime, setSelectedTime] = useState("Tháng này");
  return (
    <div className="mt-4">
      <div className="py-4">
        <h1 className="text-primary text-lg">Tình trạng kinh doanh</h1>
      </div>
      <CardCustom>
        <CardCustom.Header
          title="Doanh thu"
          filter={[
            { value: "Tháng này", label: "Tháng này" },
            { value: "Tháng trước", label: "Tháng trước" },
          ]}
          onChange={(data) => setSelectedTime(data)}
        />
        <CardCustom.Body>
          <Chart selectedTime={selectedTime} />
        </CardCustom.Body>
      </CardCustom>
    </div>
  );
};
const BusinessStepByStep = () => {
  const step = [
    "Xem nhà hàng số của bạn",
    "Tải bahana để nhận hàng",
    "Đặt thử nghiệm đơn hàng",
    "Xử lý đơn hàng & đặt ship",
  ];
  const {
    loadReportShopCustomer,
    shopCustomerReport,
    shopOrderReportToday,
  } = useDashboardContext();
  useEffect(() => {
    loadReportShopCustomer();
  }, []);
  return (
    <div className="mt-4">
      <div className="mt-4 flex">
        <CardCustom className="min-w-max">
          <CardCustom.Header title="Tổng số khách hàng"></CardCustom.Header>
          <CardCustom.Body>
            <div className="flex items-end">
              <div className="text-6xl">{shopCustomerReport}</div>
              <div className="ml-2 text-sm pb-1">Khách hàng</div>
            </div>
          </CardCustom.Body>
        </CardCustom>
        <CardCustom className="ml-4 w-full">
          <CardCustom.Header title="Tổng số đơn hàng trong hôm nay"></CardCustom.Header>
          <CardCustom.Body>
            <div className="grid grid-cols-2 divide-x">
              <div className="flex items-end pr-4">
                <div className="text-6xl">{shopOrderReportToday.completed}</div>
                <div className="ml-2 text-sm pb-1">đơn hàng hoàn tất hôm nay</div>
              </div>
              <div className="flex items-end pl-4">
                <div className="text-6xl">{shopOrderReportToday.pending}</div>
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
