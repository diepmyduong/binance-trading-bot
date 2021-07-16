import { Order } from "../../../../lib/repo/order.repo";
import { Img } from "../../../shared/utilities/img";
import { Spinner } from "../../../shared/utilities/spinner";
import { Button } from "../../../shared/utilities/form/button";
import { Form } from "../../../shared/utilities/form/form";
import { useOrderDetailContext } from "../providers/order-detail-provider";
import { useState, useEffect } from "react";
import { Field } from "../../../shared/utilities/form/field";
import { Textarea } from "../../../shared/utilities/form/textarea";
import { HiOutlinePhone } from "react-icons/hi";

interface PropsType extends ReactProps {
  status?: Option;
  order?: Order;
}
export function OrderStatus({ order, status }: PropsType) {
  const { cancelOrder, loading, setLoading } = useOrderDetailContext();
  const [showCancel, setShowCancel] = useState(false);
  const statusDelivery = [
    { value: "PENDING", label: "Đang chờ duyệt" },
    { value: "CONFIRMED", label: "Đang làm món" },
    { value: "DELIVERING", label: "Đang giao hàng" },
    { value: "COMPLETED", label: "Đã đến nơi" },
  ];
  const statusPickup = [
    { value: "PENDING", label: "Đang chờ duyệt" },
    { value: "COMPLETED", label: "Đã xác nhận" },
  ];
  const [statusLabelCur, setStatusLabelCur] = useState("");
  useEffect(() => {
    if (status) {
      let stas = statusDelivery.findIndex((stas) => stas.value === status.value);
      if (stas !== -1) {
        setStatusLabelCur(statusDelivery[stas].label);
      }
    }
  }, [status]);
  return (
    <div className="bg-white min-h-screen flex flex-col items-center">
      <h1 className="text-2xl sm:text-4xl text-center font-bold p-4 pt-6">{statusLabelCur}</h1>
      {status ? (
        <div className={`w-full mb-3 bg-white text-sm flex flex-col items-center`}>
          {status.value === "PENDING" && (
            <div className="flex flex-wrap-reverse items-center justify-center mt-2 gap-2">
              <Button
                text="Hủy đơn"
                outline
                primary
                asyncLoading={loading}
                className="rounded-full mr-2"
                onClick={() => {
                  setLoading(true);
                  setShowCancel(true);
                }}
              />
              <Button
                text="Gọi nhà hàng"
                primary
                href={`tel:${order.shopBranch.phone}`}
                className="rounded-full bg-gradient"
                icon={<HiOutlinePhone />}
              />
            </div>
          )}
          {status.value === "CONFIRMED" && (
            <Button
              text="Gọi nhà hàng"
              primary
              className="rounded-full bg-gradient"
              href={`tel:${order.shopBranch.phone}`}
            />
          )}
          {status.value === "DELIVERING" && (
            <div className="flex flex-wrap-reverse items-center justify-center mt-2 gap-2">
              {order.shipMethod === "AHAMOVE" && (
                <Button
                  text="Xem trên Ahamove"
                  outline
                  className="rounded-full mr-2 "
                  href={order.ahamoveTrackingLink}
                />
              )}
              <Button
                text={"Tài xế: " + order.driverName || "Gọi tài xế"}
                primary
                className="rounded-full bg-gradient"
                iconPosition="end"
                href={`tel:${order.driverPhone}`}
                icon={<HiOutlinePhone />}
              />
            </div>
          )}
          <Img
            src={
              (status.value === "PENDING" && "/assets/img/pending.png") ||
              (status.value === "CONFIRMED" && "/assets/img/confirm.png") ||
              (status.value === "DELIVERING" && "/assets/img/delivering.png")
            }
            className="w-1/2 mt-16 mb-2"
          />
          <div className="px-4">
            <ul className="flex font-semibold text-gray-800 justify-between border-t-4 whitespace-pre-wrap border-gray text-center sm:text-base text-sm">
              {order.pickupMethod === "DELIVERY"
                ? statusDelivery.map((item, index) => (
                    <li
                      key={index}
                      className={`${
                        status.value === item.value ? "opacity-100" : "opacity-40"
                      } py-3 px-1 sm:px-4`}
                    >
                      {item.label}
                    </li>
                  ))
                : statusPickup.map((item, index) => (
                    <li
                      key={index}
                      className={`${
                        status.value === item.value ? "opacity-100" : "opacity-40"
                      } py-3 px-1 sm:px-4`}
                    >
                      {item.label}
                    </li>
                  ))}
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
