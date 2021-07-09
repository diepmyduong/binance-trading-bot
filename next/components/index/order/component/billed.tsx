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
              <p className={`text-${status.color} font-bold text-sm`}>{order.statusText}</p>
              <p className="px-2">-</p>
              <p className="">{formatDate(new Date(order.createdAt), "dd-MM-yyyy HH:mm")}</p>
            </div>
            <div className="flex flex-col pt-1">
              <div className="flex items-center">
                <p className="">{order.sellerName}</p>
                {/* <p className="px-2">-</p>
                <p className="">{order.buyerAddress}</p> */}
              </div>
              <div className="flex pt-1 justify-between flex-wrap">
                <div className="flex  pt-1 whitespace-nowrap flex-1">
                  <p className="font-bold">{NumberPipe(order.subtotal)}đ</p>
                  <p className="ml-1">({order.paymentMethod})</p>
                  <p className="px-2">-</p>
                  <p className="">{order.itemCount} món</p>
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
