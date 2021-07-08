import { useState, useEffect } from "react";
import { BiRadio } from "react-icons/bi";
import { CgRadioChecked } from "react-icons/cg";
import { FaCircle } from "react-icons/fa";
import { HiArrowRight, HiChevronRight } from "react-icons/hi";
import { NumberPipe } from "../../../lib/pipes/number";
import { useAlert } from "../../../lib/providers/alert-provider";
import { Button } from "../../shared/utilities/form/button";
import { Order, OrderService } from "../../../lib/repo/order.repo";
import { Spinner } from "../../shared/utilities/spinner";
import formatDate from "date-fns/format";
interface PropsType extends ReactProps {
  id: string;
}
export function OrderDetailPage({ id, ...props }: PropsType) {
  const [order, setOrder] = useState<Order>(null);
  const alert = useAlert();

  useEffect(() => {
    loadOrder(id);
  }, [id]);

  const loadOrder = (id: string) => {
    OrderService.getOne({ id })
      .then((res) => {
        setOrder(res);
      })
      .catch((err) => {
        console.error(err);
        alert.error("Xem chi tiết đơn hàng thất bại", err.message);
      });
  };
  return (
    <>
      {order ? (
        <div className="text-gray-800">
          <div className="w-full text-sm bg-white px-4">
            <div className="grid grid-cols-2 w-full pt-4">
              <div className="flex flex-col space-y-1">
                <p className="text-xs text-gray-500">Mã đơn hàng</p>
                <p className="uppercase font-bold">{order.code}</p>
                <p className="text-xs text-gray-500">
                  Ngày: {formatDate(new Date(order.createdAt), "dd-MM-yyyy mm:HH")}
                </p>
              </div>
              <div className="flex flex-col space-y-1 pl-2 border-l">
                <p className="text-xs text-gray-500">Tình trạng</p>
                <p className="text-accent">Chưa xác nhận</p>
              </div>
            </div>
            <div className="flex items-center">
              <i className="text-primary text-xl ">
                <CgRadioChecked />
              </i>
              <div className="text-xs py-6 flex flex-col space-y-1 ml-2">
                <p className="text-gray-500">Gửi đến</p>
                <p className="">
                  <span className="font-bold">{order.buyerName}</span>({order.buyerPhone})
                </p>
                <p className="">
                  {order.buyerAddress}, {order.buyerWard}, {order.buyerDistrict},{" "}
                  {order.buyerProvince}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-1 bg-white">
            <p className="font-bold px-4 py-2"></p>
            <div className="">
              {order.items.map((item, index) => {
                const last = order.items.length - 1 == index;
                return (
                  <div
                    className={`flex px-4 items-start border-gray-300 py-3 ${!last && "border-b"}`}
                    key={index}
                  >
                    <div className="font-bold text-primary flex items-center">
                      <div className="min-w-4 text-center">{item.qty}</div>
                      <div className="px-1">X</div>
                    </div>
                    <div className="flex-1 flex flex-col text-gray-700">
                      <div className="font-semibold">{item.productName}</div>
                      {!!item.toppings.length && (
                        <div>{item.toppings.map((topping) => topping.optionName).join(", ")}</div>
                      )}
                      {item.note && <div>{item.note}</div>}
                    </div>
                    <div className="font-bold">{NumberPipe(item.amount, true)}</div>
                  </div>
                );
              })}
            </div>
            <div className="px-4 py-6 border-b border-gray-300">
              <div className="flex justify-between items-center">
                <div className="">
                  Tạm tính: <span className="font-bold">{order.itemCount} món</span>
                </div>
                <div className="">{NumberPipe(order.subtotal, true)}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="">
                  Phí áp dụng: <span className="font-bold">{order.shipDistance} km</span>
                </div>
                <div className="">{NumberPipe(order.shipfee, true)}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="">Giảm giá:</div>
                <div className="text-accent">{NumberPipe(0, true)}</div>
              </div>
            </div>
            <div className="px-4 py-6 flex items-center justify-between">
              <div className="">Tổng cộng:</div>
              <div className="font-bold">{NumberPipe(order.amount, true)}</div>
            </div>
            <div className="p-2 sticky bottom-0 w-full bg-white">
              <Button text="Gọi nhà hàng" primary large className="w-full" />
            </div>
          </div>
        </div>
      ) : (
        <Spinner />
      )}
    </>
  );
}

const data = [
  {
    title: "Rau má đậu xanh",
    count: 12,
    note: "Không đá ít đường",
    price: 119000,
  },
  {
    title: "Cơm đùi gà quay",
    count: 2,
    note: "Không cơm ít gà",
    price: 119000,
  },
];
