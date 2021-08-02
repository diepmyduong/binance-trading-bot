import { NextSeo } from "next-seo";
import { CollaboratorsPage } from "../../components/shop/collaborators/collaborators-page";
import { ShopLayout } from "../../layouts/shop-layout/shop-layout";

export default function Page() {
  return (
    <>
      <NextSeo title="Cộng tác viên" />
      <CollaboratorsPage />
    </>
  );
}

Page.Layout = ShopLayout;
