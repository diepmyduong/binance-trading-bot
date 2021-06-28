import { useEffect } from "react";
import { Spinner } from "../../components/shared/utilities/spinner";
import { useAuth } from "../../lib/providers/auth-provider";
import { DefaultHead } from "../default-head";
import { Footer } from "./components/footer";
import { Header, HeaderPropsType } from "./components/header";
import { DefaulLayoutProvider } from "./provider/default-layout-provider";
import { useShopContext, ShopProvider, ShopConsumer } from "../../lib/providers/shop-provider";
import { CartProvider } from "../../lib/providers/cart-provider";

interface PropsType extends ReactProps, HeaderPropsType {
  code?: string;
  shop?: { shopName: string; shopLogo: string };
}
export function DefaultLayout({ code, shop, ...props }: PropsType) {
  const { user, redirectToWebappLogin } = useAuth();

  return (
    <DefaulLayoutProvider>
      <ShopProvider code={code} shop={shop}>
        <CartProvider>
          <ShopConsumer>
            {({ shop }) => (
              <>
                {!shop ? (
                  <Spinner />
                ) : (
                  <div className="flex flex-col min-h-screen relative">
                    <>
                      <DefaultHead />
                      <Header {...props} />
                      <div className="w-full max-w-lg mx-auto">
                        <div className="w-full flex-1 mt-14 bg-bluegray-100 text-gray-700">
                          {props.children}
                        </div>
                      </div>
                      {/* <Footer /> */}
                    </>
                  </div>
                )}
              </>
            )}
          </ShopConsumer>
        </CartProvider>
      </ShopProvider>
    </DefaulLayoutProvider>
  );
}
