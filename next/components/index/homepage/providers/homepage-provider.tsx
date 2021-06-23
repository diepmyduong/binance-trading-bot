import { createContext, useContext, useEffect, useState } from "react";

export const HomeContext = createContext<Partial<{}>>({});

export function HomeProvider(props) {
  useEffect(() => {}, [props.productId]);
  return <HomeContext.Provider value={{}}>{props.children}</HomeContext.Provider>;
}

export const useHomeContext = () => useContext(HomeContext);
