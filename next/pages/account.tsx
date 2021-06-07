import { NextSeo } from "next-seo";
import { AccountPage } from "../components/index/account/account-page";
import { DefaultLayout } from "../layouts/default-layout/default-layout";

export default function Account() {
  return (
    <>
      <NextSeo title="Tài khoản" />
      <AccountPage />;
    </>
  );
}
Account.Layout = DefaultLayout;
