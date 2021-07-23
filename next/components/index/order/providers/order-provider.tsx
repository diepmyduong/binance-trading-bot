import { createContext, useContext, useEffect, useState } from "react";
import { Order, OrderService, ORDER_STATUS } from "../../../../lib/repo/order.repo";
import cloneDeep from "lodash/cloneDeep";
import { PaginationQueryProps, usePaginationQuery } from "../../../../lib/hooks/usePaginationQuery";

export const OrderContext = createContext<PaginationQueryProps<Order> & Partial<{}>>({});

export function OrderProvider(props) {
  const context = usePaginationQuery(
    OrderService,
    null,
    {
      order: { createdAt: -1 },
    },
    undefined, // fragment
    false // cache
  );
  return <OrderContext.Provider value={{ ...context }}>{props.children}</OrderContext.Provider>;
}

export const useOrderContext = () => useContext(OrderContext);
export const OrderConsumer = ({
  children,
}: {
  children: (props: Partial<{ orders: Order[] }>) => any;
}) => {
  return <OrderContext.Consumer>{children}</OrderContext.Consumer>;
};
