import { createContext, useContext, useEffect, useState } from "react";
import { Shop, ShopService } from "../repo/shop.repo";
import { useRouter } from "next/router";
import { SetAnonymousToken } from "../graphql/auth.link";
import cloneDeep from "lodash/cloneDeep";
import { Category, CategoryService } from "../repo/category.repo";
import { ShopBranchService, ShopBranch } from "../repo/shop-branch.repo";

export const ShopContext = createContext<
  Partial<{
    shop: Shop;
    setShop: Function;
    customer: any;
    productIdSelected: any;
    setProductIdSelected: any;
    cunstomerLogin: Function;
    customerLogout: Function;
    shopCode: string;
    setShopCode: Function;
    productShop: Category[];
    shopBranchs: ShopBranch[];
    branchSelecting: ShopBranch;
    setBranchSelecting: Function;
  }>
>({});
export function ShopProvider(props) {
  const router = useRouter();
  const [shopCode, setShopCode] = useState<string>();
  const [branchSelecting, setBranchSelecting] = useState<ShopBranch>(null);
  const [shop, setShop] = useState<Shop>();
  const [productIdSelected, setProductIdSelected] = useState<any>(null);
  const [productShop, setProductShop] = useState<Category[]>(null);
  const [customer, setCustomer] = useState<any>();
  const [shopBranchs, setShopBranch] = useState<ShopBranch[]>();
  async function getShop() {
    let haveShop = "";
    if (shopCode && shop) {
      haveShop = shopCode;
      sessionStorage.setItem("shopCode", shopCode);
      sessionStorage.setItem("shop", JSON.stringify(shop));
    } else {
      let scode = sessionStorage.getItem("shopCode");
      let shopStorage = sessionStorage.getItem("shop");
      if (scode && JSON.parse(shopStorage)) {
        setShop(JSON.parse(shopStorage));
        setShopCode(scode);
        haveShop = scode;
      }
    }
    if (haveShop) {
      console.log(haveShop);
      let token = await ShopService.loginAnonymous(haveShop);
      SetAnonymousToken(token);
      let cats = await CategoryService.getAll();
      console.log(cats);
      if (cats) {
        setProductShop(cloneDeep(cats.data));
      }
      let branchs = await ShopBranchService.getAll();
      console.log(branchs);
      if (branchs) {
        setShopBranch(cloneDeep(branchs.data));
        setBranchSelecting(branchs.data[0]);
      }
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
      router.push(location.href, null, { shallow: true });
    }
  }

  useEffect(() => {
    let res = sessionStorage.getItem("shop");
    console.log(res);
  }, []);
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
        setShop,
        setShopCode,
        branchSelecting,
        shopBranchs,
        setBranchSelecting,
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
