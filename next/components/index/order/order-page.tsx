import { Billed } from "./component/billed";
import { OrderProvider, useOrderContext } from "./providers/order-provider";
import { Spinner } from "../../shared/utilities/spinner";
import BreadCrumbs from "../../shared/utilities/breadcrumbs/breadcrumbs";
import { useShopContext } from "../../../lib/providers/shop-provider";
import { useCartContext } from "../../../lib/providers/cart-provider";
import { ORDER_STATUS } from "../../../lib/repo/order.repo";

export function OrderPage() {
  const { shopCode } = useShopContext();
  return (
    <OrderProvider>
      <div className="w-full bg-white relative min-h-screen">
        <BreadCrumbs
          breadcrumbs={[
            { label: "Trang chủ", href: `/${shopCode}` },
            { label: "Lịch sử đơn hàng" },
          ]}
          className="py-4 pl-4"
        />
        <ListOrder />
      </div>
    </OrderProvider>
  );
}

function ListOrder() {
  const { items } = useOrderContext();
  const { reOrder } = useCartContext();
  if (!items) return <Spinner />;
  if (items.length == 0)
    return <div className="px-4 text-center mt-20">Chưa có đơn hàng thuộc trạng thái này</div>;
  return (
    <div className="bg-gray-light border-t-2">
      {items.map((order, index) => (
        <Billed
          order={order}
          key={index}
          status={ORDER_STATUS.find((stus) => stus.value === order.status)}
          reOrder={(items, infoPay) => reOrder(items, infoPay)}
        />
      ))}
      {/* <Pagination /> */}
    </div>
  );
}
