import Link from "next/link";
import { HiChevronRight } from "react-icons/hi";
import { NumberPipe } from "../../../../lib/pipes/number";
import { Order, OrderInput, OrderItem, OrderService } from "../../../../lib/repo/order.repo";
import { Button } from "../../../shared/utilities/form/button";
import formatDate from "date-fns/format";
import { CartProduct } from "../../../../lib/providers/cart-provider";
import { useToast } from "../../../../lib/providers/toast-provider";

interface PropsType extends ReactProps {
  status: Option;
  order?: Order;
  reOrder?: (items: OrderItem[], infoPay: OrderInput) => any;
}
export function Billed({ order, status, reOrder }: PropsType) {
  const toast = useToast();
  function reOrderClick(order: Order) {
    OrderService.getOne({ id: order.id })
      .then((res) => {
        const {
          promotionCode,
          buyerName,
          buyerPhone,
          pickupMethod,
          shopBranchId,
          pickupTime,
          buyerAddress,
          buyerProvinceId,
          buyerDistrictId,
          buyerWardId,
          buyerFullAddress,
          buyerAddressNote,
          latitude,
          longitude,
          paymentMethod,
          note,
        } = res;
        reOrder(res.items, {
          promotionCode,
          buyerName,
          buyerPhone,
          pickupMethod,
          shopBranchId,
          pickupTime,
          buyerAddress,
          buyerProvinceId,
          buyerDistrictId,
          buyerWardId,
          buyerFullAddress,
          buyerAddressNote,
          latitude,
          longitude,
          paymentMethod,
          note,
        });
      })
      .catch((err) => toast.error("Đã xảy ra lỗi. Vui lòng chọn đơn hàng khác"));
  }
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
              href={`tel:${order.shopBranch.phone}`}
            />
          ),
          CONFIRMED: (
            <Button
              text="Gọi nhà hàng"
              className=" whitespace-nowrap w-full"
              textPrimary
              hoverSuccess
              href={`tel:${order.shopBranch.phone}`}
            />
          ),
          CANCELED: (
            <Button
              text="Đặt lại"
              textPrimary
              hoverSuccess
              className=" whitespace-nowrap w-full"
              asyncLoading
              onClick={async () => await reOrderClick(order)}
            />
          ),
          RETURNED: (
            <Button
              text="Đặt lại"
              textPrimary
              hoverSuccess
              className=" whitespace-nowrap w-full"
              onClick={async () => await reOrderClick(order)}
            />
          ),
          FAILURE: (
            <Button
              text="Đặt lại"
              textPrimary
              hoverSuccess
              className=" whitespace-nowrap w-full"
              onClick={async () => await reOrderClick(order)}
            />
          ),
          COMPLETED: (
            <Button
              text="Đặt lại"
              textPrimary
              hoverSuccess
              className=" whitespace-nowrap w-full"
              onClick={async () => await reOrderClick(order)}
            />
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
