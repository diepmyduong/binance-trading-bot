import { Order } from "../../../../lib/repo/order.repo";
import { Img } from "../../../shared/utilities/img";
import { Spinner } from "../../../shared/utilities/spinner";
import { Button } from "../../../shared/utilities/form/button";
import { Form } from "../../../shared/utilities/form/form";
import { useOrderDetailContext } from "../providers/order-detail-provider";
import { useState } from "react";
import { Field } from "../../../shared/utilities/form/field";
import { Textarea } from "../../../shared/utilities/form/textarea";

interface PropsType extends ReactProps {
  status?: Option;
  order?: Order;
}
export function OrderStatus({ order, status }: PropsType) {
  const { cancelOrder, loading, setLoading } = useOrderDetailContext();
  const [showCancel, setShowCancel] = useState(false);

  return (
    <div className="bg-white min-h-screen">
      <h1 className="text-xl text-center font-bold p-4">Đang {status?.label}</h1>
      {status ? (
        <div className={`w-full mb-3 bg-white text-sm`}>
          {status.value === "PENDING" && (
            <>
              <Button text="Gọi nhà hàng" primary className="w-full" href={`tel:${"0374196903"}`} />
              <Button
                text="Hủy đơn"
                outline
                primary
                asyncLoading={loading}
                className="w-full my-2"
                onClick={() => {
                  setLoading(true);
                  setShowCancel(true);
                }}
              />{" "}
              <Img src="/assets/img/pending.png" ratio169 />
            </>
          )}
          {status.value === "CONFIRMED" && <Img src="/assets/img/confirm.png" />}
          {status.value === "DELIVERING" && <Img src="/assets/img/delivering.png" />}
          <div className="px-4">
            <ul className="flex sm:gap-5 gap-2 font-semibold justify-between border-t-2 text-center sm:text-base text-xs">
              <li className={`${status.value === "PENDING" ? "text-gray-800" : "text-gray-500"}`}>
                Đang chờ duyệt
              </li>
              <li className={`${status.value === "CONFIRMED" ? "text-gray-800" : "text-gray-500"}`}>
                Đang làm món
              </li>
              <li
                className={`${status.value === "DELIVERING" ? "text-gray-800" : "text-gray-500"}`}
              >
                Đang giao hàng
              </li>
              <li className={`${status.value === "COMPLETED" ? "text-gray-800" : "text-gray-500"}`}>
                Đã đến nơi
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <Spinner />
      )}
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
  );
}
