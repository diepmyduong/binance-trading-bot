import { NextSeo } from "next-seo";
import ShopLoginPage from "../../components/shop/login/login-page";
import { NoneLayout } from "../../layouts/none-layout/none-layout";

export default function Page() {
  return (
    <>
      <NextSeo title="Đăng nhập cửa hàng" />
      <ShopLoginPage />
    </>
  );
}

Page.Layout = NoneLayout;
