import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { HiOutlineExclamation } from "react-icons/hi";
import { Card } from "../../components/shared/utilities/card/card";
import { NotFound } from "../../components/shared/utilities/not-found";
import { Spinner } from "../../components/shared/utilities/spinner";
import { useAuth } from "../../lib/providers/auth-provider";
import { DefaultHead } from "../default-head";
import { Header } from "./components/header";
import { AdminLayoutProvider } from "./providers/admin-layout-provider";

const Sidebar = dynamic<any>(() => import("./components/sidebar"));

interface PropsType extends ReactProps {
  scope?: string;
}
export function AdminLayout({ ...props }: PropsType) {
  const { user, redirectToAdminLogin } = useAuth();

  useEffect(() => {
    if (user === null) {
      redirectToAdminLogin();
    }
  }, [user]);

  return (
    <>
      <DefaultHead shopCode="" shopLogo="" />
      {!user ? (
        <div className="w-h-screen min-h-screen">
          <Spinner />
        </div>
      ) : (
        <AdminLayoutProvider>
          <NextSeo title="3MShop Admin" />
          <Header />
          <div className="flex pt-14 w-full relative min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col pl-60">
              <div className="p-6">
                {!props.scope || (props.scope && user.scopes.includes(props.scope)) ? (
                  props.children
                ) : (
                  <Card>
                    <NotFound icon={<HiOutlineExclamation />} text="Không đủ quyền truy cập" />
                  </Card>
                )}
              </div>
            </div>
          </div>
        </AdminLayoutProvider>
      )}
    </>
  );
}
