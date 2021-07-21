import { NextSeo } from "next-seo";
import { OrderPage } from "../../../components/index/order/order-page";
import { DefaultLayout } from "../../../layouts/default-layout/default-layout";
import { OrderProvider } from "../../../components/index/order/providers/order-provider";

export default function Page() {
  return (
    <OrderProvider>
      <NextSeo title="Lịch sử đơn hàng" />
      <OrderPage />
    </OrderProvider>
  );
}

Page.Layout = DefaultLayout;
