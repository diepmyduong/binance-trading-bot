import "@goongmaps/goong-js/dist/goong-js.css";
import { useEffect } from "react";
import { Spinner } from "../../components/shared/utilities/spinner";
import useDevice from "../../lib/hooks/useDevice";
import { useAuth } from "../../lib/providers/auth-provider";
import { DefaultHead } from "../default-head";
import Sidebar from "./components/sidebar";
import { ShopLayoutContext, ShopLayoutProvider } from "./providers/shop-layout-provider";
import { firebase } from "./../../lib/helpers/firebase";
import { useToast } from "../../lib/providers/toast-provider";
import { useRouter } from "next/router";

interface PropsType extends ReactProps {}
export function ShopLayout({ ...props }: PropsType) {
  const { member, checkMember, redirectToShopLogin } = useAuth();
  const { isSSR } = useDevice();
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (member === undefined) checkMember();
    else if (member === null) {
      redirectToShopLogin();
    } else {
      if (!isSSR) {
        const messaging = firebase.messaging();
        messaging.onMessage((payload) => {
          toast.info(`${payload.notification.title}. ${payload.notification.body || ""}`, {
            onClick: () => {
              router.push("/shop/orders");
            },
            position: "top-right",
            delay: 10000,
          });
          console.log("Message received. ", payload);
        });
      }
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
