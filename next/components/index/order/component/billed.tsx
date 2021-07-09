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
    <div
      className={`w-full mt-1 bg-white text-sm ${order.status !== status.value ? "hidden" : ""}`}
    >
      <Link href={`/order/${order.code}`}>
        <div className="flex items-center justify-between cursor-pointer hover:bg-primary-light">
          <div className="p-2 flex flex-col w-full">
            <div className="flex items-center justify-start">
              <span className={`bg-${status.color} font-bold text-sm text-white rounded-full px-2`}>
                {order.statusText}
              </span>
              <span className="px-2">-</span>
              <span className="">{formatDate(new Date(order.createdAt), "dd-MM-yyyy HH:mm")}</span>
            </div>
            <div className="flex flex-col pt-1">
              <div className="flex items-center">
                <span className="">{order.sellerName}</span>
                {/* <span className="px-2">-</span>
                <span className="">{order.buyerAddress}</span> */}
              </div>
              <div className="flex pt-1 justify-between flex-wrap">
                <div className="flex  pt-1 whitespace-nowrap flex-1">
                  <span className="font-bold">{NumberPipe(order.subtotal)}đ</span>
                  <span className="ml-1">({order.paymentMethod})</span>
                  <span className="px-2">-</span>
                  <span className="">{order.itemCount} món</span>
                </div>
                <div
                  className="w-full mt-2 sm:mt-0 sm:w-auto flex justify-end "
                  onClick={(e) => e.stopPropagation()}
                >
                  {
                    {
                      PENDING: (
                        <>
                          <Button
                            text="Gọi nhà hàng"
                            outline
                            primary
                            className="w-full ml-2 max-w-4xs whitespace-nowrap"
                            href={`tel:${"0374196903"}`}
                          />
                        </>
                      ),
                      CANCELED: (
                        <Button
                          text="Đặt lại"
                          outline
                          primary
                          className="w-full my-2 ml-2  max-w-4xs whitespace-nowrap"
                        />
                      ),
                      COMPLETED: (
                        <Button
                          text="Đặt lại"
                          outline
                          primary
                          className="w-full my-2 ml-2  max-w-4xs whitespace-nowrap"
                        />
                      ),
                    }[order.status]
                  }
                </div>
              </div>
            </div>
          </div>
          <i className="text-2xl mr-2 text-primary">
            <HiChevronRight />
          </i>
        </div>
      </Link>
    </div>
  );
}
