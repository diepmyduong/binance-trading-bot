import { useEffect } from "react";
import { Spinner } from "../../components/shared/utilities/spinner";
import { useAuth } from "../../lib/providers/auth-provider";
import { DefaultHead } from "../default-head";
import Sidebar from "./components/sidebar";
import { ShopLayoutContext, ShopLayoutProvider } from "./providers/shop-layout-provider";
import "@goongmaps/goong-js/dist/goong-js.css";

interface PropsType extends ReactProps {}
export function ShopLayout({ ...props }: PropsType) {
  const { member, checkMember, redirectToShopLogin } = useAuth();

  useEffect(() => {
    if (member === undefined) checkMember();
    else if (member === null) {
      redirectToShopLogin();
    }
  }, [member]);

  return (
    <ShopLayoutProvider>
      <ShopLayoutContext.Consumer>
        {({ shopConfig }) => (
          <>
            {!(member && shopConfig) ? (
              <div className="w-h-screen min-h-screen">
                <Spinner />
              </div>
            ) : (
              <>
                <DefaultHead />
                {/* <Header /> */}
                <div className="flex w-full relative min-h-screen">
                  <Sidebar />
                  <div className="flex-1 flex flex-col pl-60">
                    <div className="p-6">{props.children}</div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </ShopLayoutContext.Consumer>
    </ShopLayoutProvider>
  );
}
