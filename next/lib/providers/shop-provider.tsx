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
    locationCustomer: any;
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
  const [locationCustomer, setLocationCustomer] = useState<any>();
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
      console.log(branchs);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          ShopBranchService.getAllBranchDistance(
            position.coords.latitude,
            position.coords.longitude
          ).then((res) => {
            let xMin = Math.min(...res.data.map((o: ShopBranch) => o.distance));
            let minDistanceBranch = res.data.find((o) => o.distance === xMin);
            if (branchs) {
              let branch = branchs.data.find((item) => item.id === minDistanceBranch.id);
              setBranchSelecting(branch);
            }
          });
          setLocationCustomer(position.coords);
        });
      }
      if (branchs) {
        setShopBranch(cloneDeep(branchs.data));
      }
    }
    let res = await ShopService.getShopData();
    if (res) {
      setShop(cloneDeep(res));
      let phoneUser = localStorage.getItem("phoneUser");
      if (phoneUser) {
        setCustomer(phoneUser);
      } else {
        setCustomer(null);
      }
    } else {
      setShop(null);
    }
    setLoading(false);
  }
  const loginCustomerByPhone = (phone) => {};
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
    getShop();
  }, []);
  return (
    <ShopContext.Provider
      value={{
        shop,
        shopCode,
        customer,
        locationCustomer,
        customerLogin,
        customerLogout,
        productIdSelected,
        setProductIdSelected,
        categoriesShop,
        setShop,
        setShopCode,
        branchSelecting,
        shopBranchs,
        loginCustomerByPhone,
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
