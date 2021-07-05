import { createContext, useContext, useEffect, useState } from "react";

export const OrderContext = createContext<Partial<{}>>({});

export function OrderProvider(props) {
  return <OrderContext.Provider value={{}}>{props.children}</OrderContext.Provider>;
}

export const useOrderContext = () => useContext(OrderContext);
