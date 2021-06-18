import { createContext, useContext, useEffect, useState } from "react";
import { Shop, ShopService } from "../repo/shop.repo";

export const ShopContext = createContext<Partial<{ shop: Shop }>>({});
export function ShopProvider(props) {
  const [shop, setShop] = useState<Shop>();
  async function getShop() {
    let res = await ShopService.getShopData();
    console.log(res);

    if (res) {
      setShop(res);
    } else {
      setShop(null);
    }
  }
  useEffect(() => {
    getShop();
  }, []);
  return <ShopContext.Provider value={{ shop }}>{props.children}</ShopContext.Provider>;
}

export const useShopContext = () => useContext(ShopContext);
