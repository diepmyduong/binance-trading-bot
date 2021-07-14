import { NextSeo } from "next-seo";
import { StaffsPage } from "../../components/shop/staffs/staffs-page";
import { VouchersPage } from "../../components/shop/vouchers/vouchers-page";
import { ShopLayout } from "../../layouts/shop-layout/shop-layout";

export default function Page() {
  return (
    <>
      <NextSeo title="Khuyến mãi" />
      <VouchersPage />
    </>
  );
}

Page.Layout = ShopLayout;
