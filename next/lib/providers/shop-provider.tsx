import { createContext, useContext, useEffect, useState } from "react";
import { Shop, ShopService } from "../repo/shop.repo";
import { useRouter } from "next/router";
import { SetAnonymousToken } from "../graphql/auth.link";
import cloneDeep from "lodash/cloneDeep";
import { Category, CategoryService } from "../repo/category.repo";
import { ShopBranchService, ShopBranch } from "../repo/shop-branch.repo";
import { UserService } from "../repo/user.repo";

export const ShopContext = createContext<
  Partial<{
    shop: Shop;
    setShop: Function;
    customer: any;
    productIdSelected: any;
    setProductIdSelected: any;
    customerLogin: Function;
    customerLogout: Function;
    shopCode: string;
    setShopCode: Function;
    categoriesShop: Category[];
    shopBranchs: ShopBranch[];
    branchSelecting: ShopBranch;
    setBranchSelecting: Function;
    loginCustomerByPhone: Function;
    loading: boolean;
  }>
>({});
export function ShopProvider(props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [shopCode, setShopCode] = useState<string>();
  const [branchSelecting, setBranchSelecting] = useState<ShopBranch>(null);
  const [shop, setShop] = useState<Shop>();
  const [productIdSelected, setProductIdSelected] = useState<any>(null);
  const [categoriesShop, setcategoriesShop] = useState<Category[]>(null);
  const [customer, setCustomer] = useState<any>();
  const [shopBranchs, setShopBranch] = useState<ShopBranch[]>();
  async function getShop() {
    setLoading(true);
    let haveShop = "";
    if (shopCode && shop) {
      haveShop = shopCode;
      sessionStorage.setItem("shopCode", shopCode);
      sessionStorage.setItem("shop", JSON.stringify(shop));
    } else {
      let scode = sessionStorage.getItem("shopCode");
      let shopStorage = sessionStorage.getItem("shop");
      if (scode && JSON.parse(shopStorage)) {
        setShopCode(scode);
        haveShop = scode;
      }
    }
    if (haveShop) {
      let token = await ShopService.loginAnonymous(haveShop);
      SetAnonymousToken(token);
      let cats = await CategoryService.getAll({
        query: {
          limit: 0,
          order: { priority: -1, createdAt: 1 },
        },
        fragment: CategoryService.fullFragment,
      });
      if (cats) {
        setcategoriesShop(cloneDeep(cats.data));
      }
      let branchs = await ShopBranchService.getAll();
      if (branchs) {
        setShopBranch(cloneDeep(branchs.data));
      }
    }
    let res = await ShopService.getShopData();
    if (res) {
      setShop(cloneDeep(res));
    } else {
      setShop(null);
    }
    setLoading(false);
  }
  function customerLogin(phone: string) {
    if (phone) {
      UserService.loginCustomerByPhone(phone).then((res: { loginCustomerByPhone: any }) => {
        localStorage.setItem("customer-token", res.loginCustomerByPhone.token);
      });
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
        customerLogin,
        customerLogout,
        productIdSelected,
        setProductIdSelected,
        categoriesShop,
        setShop,
        setShopCode,
        branchSelecting,
        shopBranchs,
        setBranchSelecting,
        loading,
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
