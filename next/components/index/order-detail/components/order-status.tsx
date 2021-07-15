import { Order } from "../../../../lib/repo/order.repo";
import { Img } from "../../../shared/utilities/img";

interface PropsType extends ReactProps {
  status: Option;
  order?: Order;
}
export function OrderStatus({ order, status }: PropsType) {
  return (
    <div className={`w-full mb-3 bg-white text-sm`}>
      {order.status && "PENDING" && <Img src="assets/img/pending.png" />}
      {order.status && "CONFIRMED" && <Img src="assets/img/confirm.png" />}
      {order.status && "DELIVERING" && <Img src="assets/img/delivering.png" />}
      {/* {
        {
          PENDING: (
            <Button
              text="Gọi nhà hàng"
              className=" whitespace-nowrap w-full"
              textPrimary
              hoverSuccess
              href={`tel:${"0374196903"}`}
            />
          ),
          CONFIRMED: (
            <Button
              text="Gọi nhà hàng"
              className=" whitespace-nowrap w-full"
              textPrimary
              hoverSuccess
              href={`tel:${"0374196903"}`}
            />
          ),
          CANCELED: (
            <Button text="Đặt lại" textPrimary hoverSuccess className=" whitespace-nowrap w-full" />
          ),
          RETURNED: (
            <Button text="Đặt lại" textPrimary hoverSuccess className=" whitespace-nowrap w-full" />
          ),
          FAILURE: (
            <Button text="Đặt lại" textPrimary hoverSuccess className=" whitespace-nowrap w-full" />
          ),
          COMPLETED: (
            <Button text="Đặt lại" textPrimary hoverSuccess className=" whitespace-nowrap w-full" />
          ),
          DELIVERING: (
            <>
              {order.shipMethod === "AHAMOVE" && (
                <Button
                  text="Xem trên Ahamove"
                  textPrimary
                  hoverSuccess
                  className=" whitespace-nowrap w-full"
                  href={order.ahamoveTrackingLink}
                />
              )}
            </>
          ),
        }[order.status]
      } */}
    </div>
  );
}
