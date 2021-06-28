import { createContext, useContext, useEffect, useState } from "react";
import { Shop, ShopService } from "../repo/shop.repo";
import { useRouter } from "next/router";
import { SetAnonymousToken } from "../graphql/auth.link";
import { ProductService } from "../repo/product.repo";

export const ShopContext = createContext<
  Partial<{
    shop: Shop;
    customer: any;
    productIdSelected: any;
    setProductIdSelected: any;
    cunstomerLogin: Function;
    customerLogout: Function;
  }>
>({});
export function ShopProvider(props) {
  const router = useRouter();
  const [shop, setShop] = useState<Shop>();
  const [productIdSelected, setProductIdSelected] = useState<any>(null);
  // const [homeShop, setHomeShop] = useState<string>();
  const [customer, setCustomer] = useState<any>();
  async function getShop() {
    if (props.code) {
      console.log(props.code);
      let token = await ShopService.loginAnonymous(props.code);
      SetAnonymousToken(token);
    }
    if (props.shop) {
      setShop(props.shop);
      sessionStorage.setItem("shop", JSON.stringify(props.shop));
    } else {
      let shopStorage = sessionStorage.getItem("shop");
      if (shopStorage) {
        setShop(JSON.parse(shopStorage));
      }
    }
    let res = await ProductService.getAll();
    console.log(res);

    // let res = await ShopService.getShopData();
    // console.log(res);
    // if (res) {
    //   setShop(res);
    // } else {
    //   setShop(null);
    // }
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
    <ShopContext.Provider
      value={{
        shop,
        customer,
        cunstomerLogin,
        customerLogout,
        productIdSelected,
        setProductIdSelected,
      }}
    >
      {props.children}
    </ShopContext.Provider>
  );
}

export const useShopContext = () => useContext(ShopContext);
export const ShopConsumer = ({
  children,
}: {
  children: (props: Partial<{ shop: Shop }>) => any;
}) => {
  return <ShopContext.Consumer>{children}</ShopContext.Consumer>;
};
