import { NextSeo } from "next-seo";
import { ShopRegisterPage } from "../../components/shop/register/register-page";
import { NoneLayout } from "../../layouts/none-layout/none-layout";

export default function Page() {
  return (
    <>
      <NextSeo title="Đăng ký cửa hàng" />
      <ShopRegisterPage />
    </>
  );
}

Page.Layout = NoneLayout;
