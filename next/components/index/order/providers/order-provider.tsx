import { createContext, useContext, useEffect, useState } from "react";
import { Order, OrderService, ORDER_STATUS } from "../../../../lib/repo/order.repo";
import cloneDeep from "lodash/cloneDeep";

export const OrderContext = createContext<
  Partial<{ orders: Order[]; statusOrder: Option[]; statusCur: number; setStatusCur: Function }>
>({});

export function OrderProvider(props) {
  const [orders, setOrders] = useState<Order[]>();
  const statusOrder = ORDER_STATUS;
  const [statusCur, setStatusCur] = useState<number>(0);
  async function loadOrders() {
    setOrders(null);
    let res = await OrderService.getAll({
      query: { filter: { status: statusOrder[statusCur].value } },
    });
    if (res) {
      setOrders(cloneDeep(res.data));
    }
  }
  useEffect(() => {
    loadOrders();
  }, [statusCur]);
  return (
    <OrderContext.Provider value={{ orders, statusOrder, statusCur, setStatusCur }}>
      {props.children}
    </OrderContext.Provider>
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
