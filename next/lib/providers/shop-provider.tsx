import { createContext, useContext, useEffect, useState } from "react";
import { Shop, ShopService } from "../repo/shop.repo";
import { useRouter } from "next/router";

export const ShopContext = createContext<
  Partial<{ shop: Shop; customer: any; cunstomerLogin: Function; customerLogout: Function }>
>({});
export function ShopProvider(props) {
  const router = useRouter();
  const [shop, setShop] = useState<Shop>();
  const [customer, setCustomer] = useState<any>();
  async function getShop() {
    let res = await ShopService.getShopData();
    console.log(res);
    if (res) {
      setShop(res);
    } else {
      setShop(null);
    }
  }
  function cunstomerLogin(phone: string) {
    if (phone) {
      localStorage.setItem("phoneUser", phone);
      setCustomer(phone);
    }
  }
  function customerLogout() {
    localStorage.removeItem("phoneUser");
    setCustomer(null);
    if (router.pathname !== "/") {
      router.reload();
    }
  }
  useEffect(() => {
    getShop();
    let phoneUser = localStorage.getItem("phoneUser");
    if (phoneUser) {
      setCustomer(phoneUser);
    } else {
      setCustomer(null);
    }
  }, []);
  return (
    <ShopContext.Provider value={{ shop, customer, cunstomerLogin, customerLogout }}>
      {props.children}
    </ShopContext.Provider>
  );
}

export const useShopContext = () => useContext(ShopContext);
