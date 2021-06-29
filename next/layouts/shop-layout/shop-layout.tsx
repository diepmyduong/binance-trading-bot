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

export function ShopLayout() {
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
          <div className="flex pt-14 w-full relative min-h-screen">
            <Sidebar />
          </div>
        </>
      )}
    </>
  );
}
