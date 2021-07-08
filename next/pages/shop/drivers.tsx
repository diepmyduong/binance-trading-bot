import { NextSeo } from "next-seo";
import { DriversPage } from "../../components/shop/drivers/drivers-page";
import { ShopLayout } from "../../layouts/shop-layout/shop-layout";

export default function Page() {
  return (
    <>
      <NextSeo title="Tài xế nội bộ" />
      <DriversPage />
    </>
  );
}

Page.Layout = ShopLayout;
