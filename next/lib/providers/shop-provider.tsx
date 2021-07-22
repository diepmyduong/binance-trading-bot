import { createContext, useContext, useEffect, useState } from "react";
import { Shop, ShopService } from "../repo/shop.repo";
import { useRouter } from "next/router";
import {
  SetAnonymousToken,
  SetCustomerToken,
  ClearAnonymousToken,
  ClearCustomerToken,
} from "../graphql/auth.link";
import cloneDeep from "lodash/cloneDeep";
import { Category, CategoryService } from "../repo/category.repo";
import { ShopBranchService, ShopBranch } from "../repo/shop-branch.repo";
import { UserService } from "../repo/user.repo";
import sortBy, { orderBy } from "lodash";
import { Customer } from "../repo/customer.repo";

export const ShopContext = createContext<
  Partial<{
    shop: Shop;
    setShop: Function;
    customer: Customer;
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
    setCustomer: Function;
  }>
>({});
export function ShopProvider(props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [shopCode, setShopCode] = useState<string>();
  const [branchSelecting, setBranchSelecting] = useState<ShopBranch>();
  const [shop, setShop] = useState<Shop>();
  const [productIdSelected, setProductIdSelected] = useState<any>(null);
  const [categoriesShop, setcategoriesShop] = useState<Category[]>(null);
  const [customer, setCustomer] = useState<Customer>();
  const [shopBranchs, setShopBranch] = useState<ShopBranch[]>([]);
  const [locationCustomer, setLocationCustomer] = useState<any>();
  async function getShop() {
    setLoading(true);
    let haveShop = "";
    if (shopCode && shop) {
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
    let brsnav = null;
    if (haveShop) {
      ClearAnonymousToken();
      ClearCustomerToken();
      let token = await ShopService.loginAnonymous(haveShop);
      SetAnonymousToken(token);
      let phoneUser = localStorage.getItem("phoneUser");
      if (phoneUser) {
        let dataCus = await UserService.loginCustomerByPhone(phoneUser);
        if (dataCus) {
          console.log(dataCus.customer);
          SetCustomerToken(dataCus.token);
          setCustomer(cloneDeep(dataCus.customer));
          localStorage.setItem("phoneUser", dataCus.customer.phone);
        } else {
          setCustomer(null);
        }
      } else {
        setCustomer(null);
      }
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
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          ShopBranchService.getAll({
            fragment: `${ShopBranchService.fullFragment} distance(lat:${position.coords.latitude}, lng:${position.coords.longitude})`,
            query: { order: { distance: 1 } },
          }).then((res) => {
            brsnav = res.data;
            let branchs = res.data;
            let branchsSorted = orderBy(branchs, (o) => o.distance);
            console.log(branchsSorted);
            setShopBranch(cloneDeep(branchsSorted));
            let neared = branchsSorted.findIndex((item) => item.isOpen);
            if (neared) {
              setBranchSelecting(branchsSorted[neared]);
            } else {
              setBranchSelecting(null);
            }
          });
          setLocationCustomer(position.coords);
        });
      } else {
      }
    }
    let brs = await ShopBranchService.getAll();
    if (brs && !brsnav) {
      setShopBranch(cloneDeep(brs.data));
      let active = brs.data.findIndex((item) => item.isOpen);
      setBranchSelecting(brs.data[active]);
    }
    let res = await ShopService.getShopData();

    if (res) {
      setShop(cloneDeep(res));
    } else {
      setShop(null);
    }

    setLoading(false);
  }
  async function customerLogin(phone: string) {
    if (phone) {
      let dataCus = await UserService.loginCustomerByPhone(phone);
      if (dataCus) {
        SetCustomerToken(dataCus.token);
        setCustomer(cloneDeep(dataCus.customer));
        localStorage.setItem("phoneUser", dataCus.customer.phone);
      } else {
        setCustomer(null);
      }
    } else {
      setCustomer(null);
    }
  }
  function customerLogout() {
    localStorage.removeItem("phoneUser");
    localStorage.removeItem("customer-token");
    setCustomer(null);
    if (router.pathname !== "/") {
      router.push(`/${shopCode}`);
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
        setBranchSelecting,
        loading,
        setCustomer,
      }}
    >
      {props.children}
    </ShopContext.Provider>
  );
}

export const useShopContext = () => useContext(ShopContext);
