import { NextSeo } from "next-seo";
import { LoginPage } from "../../components/admin/login/login-page";
import { NoneLayout } from "../../layouts/none-layout/none-layout";

export default function Page() {
  return (
    <>
      <NextSeo title="Đăng nhập Admin" />
      <LoginPage />
    </>
  );
}

Page.Layout = NoneLayout;
