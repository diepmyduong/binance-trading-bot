import { useEffect } from "react";
import { Spinner } from "../../components/shared/utilities/spinner";
import { useAuth } from "../../lib/providers/auth-provider";
import { DefaultHead } from "../default-head";
import { Footer } from "./components/footer";
import { Header, HeaderPropsType } from "./components/header";
import { DefaulLayoutProvider } from "./provider/default-layout-provider";
import { useShopContext } from "../../lib/providers/shop-provider";

interface PropsType extends ReactProps, HeaderPropsType {}
export function DefaultLayout({ ...props }: PropsType) {
  const { user, redirectToWebappLogin } = useAuth();
  const { shop } = useShopContext();

  // useEffect(() => {
  //   if (user === null) {
  //     redirectToWebappLogin();
  //   }
  // }, [user]);

  return (
    <DefaulLayoutProvider>
      {!shop ? (
        <Spinner />
      ) : (
        <div className="flex flex-col min-h-screen relative">
          <>
            <DefaultHead />
            <Header {...props} />
            <div className="w-full max-w-lg mx-auto">
              <div className="w-full flex-1 mt-14 bg-bluegray-100">{props.children}</div>
            </div>
          </>
        </div>
      )}
    </DefaulLayoutProvider>
  );
}
