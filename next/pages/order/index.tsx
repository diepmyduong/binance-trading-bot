import { NextSeo } from "next-seo";
import { OrderPage } from "../../components/index/order/order-page";
import { DefaultLayout } from "../../layouts/default-layout/default-layout";

export default function Page() {
  return (
    <>
      <NextSeo title="Lịch sử đơn hàng" />
      <OrderPage />
    </>
  );
}

Page.Layout = DefaultLayout;
