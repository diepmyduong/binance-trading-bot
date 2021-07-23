import { createContext, useContext, useEffect, useState } from "react";
import { Shop, ShopService } from "../repo/shop.repo";
import { useRouter } from "next/router";
import {
  SetAnonymousToken,
  SetCustomerToken,
  ClearAnonymousToken,
  ClearCustomerToken,
  GetAnonymousToken,
  GetCustomerToken,
} from "../graphql/auth.link";
import cloneDeep from "lodash/cloneDeep";
import { Category, CategoryService } from "../repo/category.repo";
import { ShopBranchService, ShopBranch } from "../repo/shop-branch.repo";
import { UserService } from "../repo/user.repo";
import sortBy, { orderBy } from "lodash";
import { Customer, CustomerService } from "../repo/customer.repo";

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
  let [shopCode, setShopCode] = useState<string>();
  let [branchSelecting, setBranchSelecting] = useState<ShopBranch>();
  let [shop, setShop] = useState<Shop>();
  const [productIdSelected, setProductIdSelected] = useState<any>(null);
  let [customer, setCustomer] = useState<Customer>();
  let [shopBranchs, setShopBranch] = useState<ShopBranch[]>([]);
  const [locationCustomer, setLocationCustomer] = useState<any>();
  async function getShop() {
    setLoading(true);
    shopCode = sessionStorage.getItem("shopCode");
    if (!shopCode) router.push("404");
    setShopCode(shopCode);

    const anonymousToken = GetAnonymousToken(shopCode);
    if (!anonymousToken) await ShopService.loginAnonymous(shopCode);
    console.log("GET SHOP DATA", shopCode);
    await ShopService.getShopData().then(setShop);
    const customerToken = GetCustomerToken(shopCode);
    if (!customerToken) {
      let phoneUser = localStorage.getItem("phoneUser");
      if (phoneUser) {
        let dataCus = await UserService.loginCustomerByPhone(phoneUser);
        if (dataCus) {
          SetCustomerToken(dataCus.token, shopCode);
          customer = cloneDeep(dataCus.customer);
          setCustomer(customer);
        } else {
          setCustomer(null);
        }
      } else {
        setCustomer(null);
      }
    } else {
      await getCustomner();
    }
    setLoading(false);
  }
  function loadLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationCustomer(position.coords);
        },
        (err) => {
          if (customer && customer.latitude && customer.longitude) {
            setLocationCustomer({ latitude: customer.latitude, longitude: customer.longitude });
          } else {
            setLocationCustomer({ latitude: 10.72883, longitude: 106.725484 });
          }
        }
      );
    }
  }
  function loadBrand(coords?: any) {
    ShopBranchService.getAll({
      fragment: `${ShopBranchService.fullFragment} ${
        coords ? `distance(lat:${coords.latitude}, lng:${coords.longitude})` : ""
      } `,
    }).then((res) => {
      let branchs = res.data;
      shopBranchs = orderBy(branchs, (o) => o.distance);
      setShopBranch(shopBranchs);
      let neared = shopBranchs.findIndex((item) => item.isOpen);
      if (neared) {
        branchSelecting = shopBranchs[neared];
        setBranchSelecting(branchSelecting);
      } else {
        setBranchSelecting(shopBranchs[0]);
      }
    });
  }

  async function getCustomner() {
    let res = await CustomerService.getCustomer();
    setCustomer(res);
  }
  async function customerLogin(phone: string) {
    if (phone) {
      let dataCus = await UserService.loginCustomerByPhone(phone);
      if (dataCus) {
        SetCustomerToken(dataCus.token, shopCode);
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
  useEffect(() => {
    if (!shop) return;
    loadLocation();
  }, [shop]);
  useEffect(() => {
    if (!locationCustomer) return;
    loadBrand(locationCustomer);
  }, [locationCustomer]);
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
