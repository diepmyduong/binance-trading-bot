import { createContext, useContext, useEffect, useState } from "react";
import { Shop, ShopService } from "../repo/shop.repo";
import { useRouter } from "next/router";
import { SetAnonymousToken } from "../graphql/auth.link";
import { Product, ProductService } from "../repo/product.repo";
import cloneDeep from "lodash/cloneDeep";
import { Category, CategoryService } from "../repo/category.repo";

export const ShopContext = createContext<
  Partial<{
    shop: Shop;
    customer: any;
    productIdSelected: any;
    setProductIdSelected: any;
    cunstomerLogin: Function;
    customerLogout: Function;
    shopCode: string;
    productShop: Category[];
  }>
>({});
export function ShopProvider(props) {
  const router = useRouter();
  const [shopCode, setShopCode] = useState<string>();
  const [shop, setShop] = useState<Shop>();
  const [productIdSelected, setProductIdSelected] = useState<any>(null);
  const [productShop, setProductShop] = useState<Category[]>(null);
  const [customer, setCustomer] = useState<any>();
  async function getShop() {
    if (props.code) {
      setShopCode(props.code);
      sessionStorage.setItem("shopCode", props.code);
      let token = await ShopService.loginAnonymous(props.code);
      SetAnonymousToken(token);
    } else {
      let scode = sessionStorage.getItem("shopCode");
      if (scode) {
        setShopCode(scode);
      }
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
    let cats = await CategoryService.getAll();
    console.log(cats);
    if (cats) {
      setProductShop(cloneDeep(cats.data));
    }
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
        shopCode,
        customer,
        cunstomerLogin,
        customerLogout,
        productIdSelected,
        setProductIdSelected,
        productShop,
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
