import { NextSeo } from "next-seo";
import { ProductToppingsPage } from "../../components/shop/product-toppings/product-toppings-page";
import { ShopLayout } from "../../layouts/shop-layout/shop-layout";

export default function Page() {
  return (
    <>
      <NextSeo title="Mẫu Topping" />
      <ProductToppingsPage />
    </>
  );
}

Page.Layout = ShopLayout;
