import { NextSeo } from "next-seo";
import { ProductsPage } from "../../components/shop/products/products-page";
import { ShopLayout } from "../../layouts/shop-layout/shop-layout";

export default function Page() {
  return (
    <>
      <NextSeo title="Món" />
      <ProductsPage />
    </>
  );
}

Page.Layout = ShopLayout;
