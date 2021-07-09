import { createContext, useContext, useEffect, useState } from "react";
import { Order, OrderService, ORDER_STATUS } from "../../../../lib/repo/order.repo";
import cloneDeep from "lodash/cloneDeep";

export const OrderContext = createContext<Partial<{ orders: Order[]; statusOrder: Option[] }>>({});

export function OrderProvider(props) {
  const [orders, setOrders] = useState<Order[]>();
  const statusOrder = ORDER_STATUS;
  async function loadOrders() {
    setOrders(null);
    let res = await OrderService.getAll({
      query: { order: { createdAt: -1 } },
    });
    if (res) {
      setOrders(cloneDeep(res.data));
    }
  }
  useEffect(() => {
    loadOrders();
  }, []);
  return (
    <OrderContext.Provider value={{ orders, statusOrder }}>{props.children}</OrderContext.Provider>
  );
}

export const useOrderContext = () => useContext(OrderContext);
export const OrderConsumer = ({
  children,
}: {
  children: (props: Partial<{ orders: Order[] }>) => any;
}) => {
  return <OrderContext.Consumer>{children}</OrderContext.Consumer>;
};
