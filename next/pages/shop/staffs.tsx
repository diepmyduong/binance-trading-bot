import { NextSeo } from "next-seo";
import { StaffsPage } from "../../components/shop/staffs/staffs-page";
import { ShopLayout } from "../../layouts/shop-layout/shop-layout";

export default function Page() {
  return (
    <>
      <NextSeo title="Nhân viên" />
      <StaffsPage />
    </>
  );
}

Page.Layout = ShopLayout;
