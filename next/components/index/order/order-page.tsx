import { Billed } from "./component/billed";
import { useOrderContext } from "./providers/order-provider";
import { Spinner } from "../../shared/utilities/spinner";
import BreadCrumbs from "../../shared/utilities/breadcrumbs/breadcrumbs";
import { useShopContext } from "../../../lib/providers/shop-provider";
import { useCartContext } from "../../../lib/providers/cart-provider";

export function OrderPage() {
  const { orders, statusOrder } = useOrderContext();
  const { shopCode } = useShopContext();
  const { reOrder } = useCartContext();
  return (
    <div className="w-full bg-white relative min-h-screen">
      <BreadCrumbs
        breadcrumbs={[{ label: "Trang chủ", href: `/${shopCode}` }, { label: "Lịch sử đơn hàng" }]}
        className="py-4 pl-4"
      />
      {orders ? (
        <>
          {orders.length > 0 ? (
            <div className="bg-gray-light border-t-2">
              {orders.map((order, index) => (
                <Billed
                  order={order}
                  key={index}
                  status={statusOrder.find((stus) => stus.value === order.status)}
                  reOrder={(items, infoPay) => reOrder(items, infoPay)}
                />
              ))}
              {/* <Pagination /> */}
            </div>
          ) : (
            <div className="px-4 text-center mt-20">Chưa có đơn hàng thuộc trạng thái này</div>
          )}
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
}
