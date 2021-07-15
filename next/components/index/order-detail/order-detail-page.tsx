import { useState, useEffect } from "react";
import { BiRadio } from "react-icons/bi";
import { CgRadioChecked } from "react-icons/cg";
import { FaCircle } from "react-icons/fa";
import { HiArrowRight, HiChevronRight } from "react-icons/hi";
import { NumberPipe } from "../../../lib/pipes/number";
import { useAlert } from "../../../lib/providers/alert-provider";
import { Button } from "../../shared/utilities/form/button";
import { Order, OrderService, ORDER_STATUS } from "../../../lib/repo/order.repo";
import { Spinner } from "../../shared/utilities/spinner";
import formatDate from "date-fns/format";
import { Form } from "../../shared/utilities/form/form";
import { Field } from "../../shared/utilities/form/field";
import { Textarea } from "../../shared/utilities/form/textarea";
import cloneDeep from "lodash/cloneDeep";
import { useOrderDetailContext } from "./providers/order-detail-provider";
export function OrderDetailPage(props) {
  const { order, status, cancelOrder, setLoading, loading } = useOrderDetailContext();
  const [showCancel, setShowCancel] = useState(false);
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
                  Ngày: {formatDate(new Date(order.createdAt), "dd-MM-yyyy HH:mm")}
                </p>
              </div>
              <div className="flex flex-col space-y-1 pl-2 border-l">
                <p className="text-xs text-gray-500">Tình trạng</p>
                {status && <p className={`text-${status.color}`}>{status.label}</p>}
              </div>
            </div>
            {order.cancelReason && (
              <div className="p-4 text-gray-500 bg-gray-50 my-2">
                Lý do hủy: {order.cancelReason}
              </div>
            )}
            <div className="flex items-center">
              <i className="text-primary text-xl ">
                <CgRadioChecked />
              </i>
              <div className="text-xs py-6 flex flex-col space-y-1 ml-2">
                <p className="text-gray-500">Gửi đến</p>
                <p className="">
                  <span className="font-bold">{order.buyerName}</span> ({order.buyerPhone})
                </p>
                <p className="">{order.buyerFullAddress}</p>
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
                      {item.note && <div>Ghi chú: {item.note}</div>}
                    </div>
                    <div className="font-bold">{NumberPipe(item.amount, true)}</div>
                  </div>
                );
              })}
            </div>
            <div className="px-4 py-6 border-b border-gray-300">
              {order.note && (
                <div className="">
                  Ghi chú đơn hàng: <span className="">{order.note}</span>
                </div>
              )}
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
                <div className="">
                  Khuyến mãi: <span className="font-bold">{order.discountDetail}</span>
                </div>
                <div className="text-danger">
                  {order.discount > 0
                    ? NumberPipe(-order?.order?.discount, true)
                    : NumberPipe(order?.order?.discount, true)}
                </div>
              </div>
            </div>
            <div className="px-4 py-6 flex items-center justify-between">
              <div className="">Tổng cộng:</div>
              <div className="font-bold text-primary">{NumberPipe(order.amount, true)}</div>
            </div>
            <div className="p-2 sticky bottom-0 w-full bg-white">
              {
                {
                  PENDING: (
                    <>
                      <Button
                        text="Gọi nhà hàng"
                        primary
                        large
                        className="w-full"
                        href={`tel:${"0374196903"}`}
                      />
                      <Button
                        text="Hủy đơn"
                        outline
                        primary
                        asyncLoading={loading}
                        large
                        className="w-full my-2"
                        onClick={() => {
                          setLoading(true);
                          setShowCancel(true);
                        }}
                      />
                    </>
                  ),
                  CANCELED: (
                    <>
                      <Button
                        text="Đến trang lịch sử"
                        outline
                        primary
                        asyncLoading={loading}
                        large
                        className="w-full my-2"
                        href="/order"
                      />
                      <Button
                        text="Đặt lại"
                        outline
                        asyncLoading={loading}
                        large
                        className="w-full my-2"
                      />
                    </>
                  ),
                  COMPLETED: (
                    <>
                      <Button
                        text="Đến trang lịch sử"
                        outline
                        primary
                        asyncLoading={loading}
                        large
                        className="w-full my-2"
                        href="/order"
                      />
                      <Button
                        text="Đặt lại"
                        outline
                        asyncLoading={loading}
                        large
                        className="w-full my-2"
                      />
                    </>
                  ),
                }[order.status]
              }
              <Form
                title="Lý do hủy"
                dialog
                isOpen={showCancel}
                onClose={() => setShowCancel(false)}
                onSubmit={(data) => {
                  cancelOrder(order.id, data.note);
                  setShowCancel(false);
                }}
              >
                <Field name="note">
                  <Textarea />
                </Field>
                <div className="">
                  <Button submit text="Xác nhận" large primary />
                </div>
              </Form>
            </div>
          </div>
        </div>
      ) : (
        <Spinner />
      )}
    </>
  );
}
