import Link from "next/link";
import { HiChevronRight } from "react-icons/hi";
import { NumberPipe } from "../../../../lib/pipes/number";
import { Order } from "../../../../lib/repo/order.repo";
import { Button } from "../../../shared/utilities/form/button";
import formatDate from "date-fns/format";

interface PropsType extends ReactProps {
  status: Option;
  order?: Order;
}
export function Billed({ order, status }: PropsType) {
  return (
    <div className={`w-full mb-3 bg-white text-sm`}>
      <Link href={`/order/${order.code}`}>
        <div className="flex items-center  px-2 justify-between cursor-pointer transition-all duration-200 hover:bg-primary-light border-b-2">
          <div className="p-2 flex flex-col w-full">
            <div className="flex items-center justify-start">
              <span className={`bg-${status.color} font-bold text-sm text-white rounded-full px-2`}>
                {order.statusText}
              </span>
              <span className="px-2">-</span>
              <span className="">{formatDate(new Date(order.createdAt), "dd-MM-yyyy HH:mm")}</span>
            </div>
            <div className="flex flex-col pt-1">
              <div className="font-bold text-lg text-ellipsis-2">
                {order.seller.shopName} - {order.shopBranch.name}
                {/* <span className="">{order.seller.shopName}</span>
                <span className="px-2">-</span>
                <span className="">{order.shopBranch.name}</span> */}
              </div>
              <div className="flex pt-1 justify-between flex-wrap">
                <div className="flex  pt-1 whitespace-nowrap flex-1">
                  <span className="font-bold">{NumberPipe(order.subtotal)}đ</span>
                  <span className="ml-1">({order.paymentMethod})</span>
                  <span className="px-2">-</span>
                  <span className="">{order.itemCount} món</span>
                </div>
              </div>
            </div>
          </div>
          <i className="text-2xl mr-2 text-primary">
            <HiChevronRight />
          </i>
        </div>
      </Link>
      {
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
      }
    </div>
  );
}
