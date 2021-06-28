import { NextSeo } from "next-seo";
import { SettingsPage } from "../../components/admin/management/settings/settings-page";
import { ShopLayout } from "../../layouts/shop-layout/shop-layout";

export default function Page() {
  return (
    <>
      <NextSeo title="Cấu hình cửa hàng" />
      <SettingsPage />
    </>
  );
}

Page.Layout = ShopLayout;
