import { useRouter } from "next/router";
import { Spinner } from "../../components/shared/utilities/spinner";
import { CartProvider } from "../../lib/providers/cart-provider";
import { ShopContext, ShopProvider } from "../../lib/providers/shop-provider";
import { DefaultHead } from "../default-head";
import { Header } from "./components/header";
import { DefaulLayoutProvider } from "./provider/default-layout-provider";

export function DefaultLayout({ ...props }) {
  const router = useRouter();

  return (
    <DefaulLayoutProvider>
      <ShopProvider>
        <CartProvider>
          <ShopContext.Consumer>
            {({ shop, shopCode, customer }) => (
              <div className="flex flex-col min-h-screen relative bg-gray-800">
                <>
                  <DefaultHead shopCode={shopCode} />
                  {shop && <Header {...props} />}
                  <div className="w-full max-w-lg mx-auto shadow-lg">
                    <div
                      className={`w-full flex-1 bg-gray-100 text-gray-700 ${
                        shop && " pt-14 "
                      } pt-14 min-h-screen`}
                    >
                      {router.pathname !== "/[code]" && customer === undefined ? (
                        <Spinner />
                      ) : (
                        props.children
                      )}
                    </div>
                  </div>
                  {/* <Footer /> */}
                </>
              </div>
            )}
          </ShopContext.Consumer>
        </CartProvider>
      </ShopProvider>
    </DefaulLayoutProvider>
  );
}
