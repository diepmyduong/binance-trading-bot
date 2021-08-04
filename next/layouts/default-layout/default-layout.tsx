import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { Spinner } from "../../components/shared/utilities/spinner";
import { SetCustomerToken } from "../../lib/graphql/auth.link";
import { CartProvider } from "../../lib/providers/cart-provider";
import { ShopProvider, useShopContext } from "../../lib/providers/shop-provider";
import { DefaultHead } from "../default-head";
import { Header } from "./components/header";
import { DefaulLayoutProvider } from "./provider/default-layout-provider";

export function DefaultLayout({ ...props }) {
  const router = useRouter();
  const [shopCode, setShopCode] = useState<string>();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let code = router.query.code as string;
    console.log(code);
    if (code) {
      setLoading(true);
      setShopCode(code);
      sessionStorage.setItem("shopCode", code);
      localStorage.setItem("shopCode", code);
      if (router.query["x-token"]) {
        SetCustomerToken(router.query["x-token"] as string, code);
      }
      if (router.query["colCode"]) {
        sessionStorage.setItem(code + "colCode", router.query["colCode"] as string);
      }
      setLoading(false);
    }
    return () => setShopCode("");
  }, [router.query.code]);
  if (!shopCode) return <Spinner />;
  return (
    <DefaulLayoutProvider>
      <ShopProvider code={shopCode}>
        <NavBar loading={loading}>{props.children}</NavBar>
      </ShopProvider>
    </DefaulLayoutProvider>
  );
}

function NavBar({ loading, ...props }) {
  const router = useRouter();
  const { shop, shopCode, customer } = useShopContext();
  if (!shop) return <></>;
  if (customer === undefined) return <Spinner />;
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen relative bg-gray-800">
        <>
          <DefaultHead shopCode={shopCode} shopLogo={shop.shopLogo} />
          <Header />
          <div className="w-full max-w-lg mx-auto shadow-lg">
            <div className={`w-full flex-1 bg-gray-100 text-gray-700 pt-14 min-h-screen`}>
              {props.children}
              {/* {router.pathname !== "/[code]" && props.customer === undefined ? (
              <Spinner />
            ) : (
              props.children
            )} */}
            </div>
          </div>
          {/* <Footer /> */}
        </>
      </div>
    </CartProvider>
  );
}
