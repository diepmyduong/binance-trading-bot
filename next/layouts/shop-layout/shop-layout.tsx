import dynamic from "next/dynamic";
import { useEffect } from "react";
import { HiOutlineExclamation } from "react-icons/hi";
import { Card } from "../../components/shared/utilities/card/card";
import { NotFound } from "../../components/shared/utilities/not-found";
import { Spinner } from "../../components/shared/utilities/spinner";
import { useAuth } from "../../lib/providers/auth-provider";
import { DefaultHead } from "../default-head";
import { Header } from "./components/header";
import Sidebar from "./components/sidebar";

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
    <>
      {!member ? (
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
  );
}
