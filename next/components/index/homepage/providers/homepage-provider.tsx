import { createContext, useContext, useEffect, useState } from "react";
import { useShopContext } from "../../../../lib/providers/shop-provider";

export const HomeContext = createContext<Partial<{}>>({});

export function HomeProvider(props) {
  useEffect(() => {
    sessionStorage.setItem("shop", JSON.stringify(props.shop));
    sessionStorage.setItem("shopCode", props.code);
  }, []);
  return <HomeContext.Provider value={{}}>{props.children}</HomeContext.Provider>;
}

export const useHomeContext = () => useContext(HomeContext);
