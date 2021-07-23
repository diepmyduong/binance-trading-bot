import { useRouter } from "next/router";
import { useEffect } from "react";

import { Spinner } from "../../components/shared/utilities/spinner";
import { SetCustomerToken } from "../../lib/graphql/auth.link";
import { CartProvider } from "../../lib/providers/cart-provider";
import { ShopProvider, useShopContext } from "../../lib/providers/shop-provider";
import { DefaultHead } from "../default-head";
import { Header } from "./components/header";
import { DefaulLayoutProvider } from "./provider/default-layout-provider";

export function DefaultLayout({ ...props }) {
  const router = useRouter();
  const shopCode = router.query.code as string;
  if (typeof sessionStorage != "undefined") {
    sessionStorage.setItem("shopCode", shopCode);
    localStorage.setItem("shopCode", shopCode);
    if (router.query["x-token"]) {
      SetCustomerToken(router.query["x-token"] as string, shopCode);
    }
  }

  if (!shopCode) return <Spinner />;
  return (
    <DefaulLayoutProvider>
      <ShopProvider>
        <NavBar>{props.children}</NavBar>
      </ShopProvider>
    </DefaulLayoutProvider>
  );
}

function NavBar(props) {
  const router = useRouter();
  const { shop, shopCode } = useShopContext();
  if (!shop) return <></>;
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
