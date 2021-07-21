import { NextSeo } from "next-seo";
import { PaymentPage } from "../../components/index/payment/payment-page";
import { DefaultLayout } from "../../layouts/default-layout/default-layout";
import { CartProvider } from "../../lib/providers/cart-provider";
import { PaymentProvider } from "../../components/index/payment/providers/payment-provider";

export default function Payment() {
  return (
    <PaymentProvider>
      <NextSeo title="Thanh toán" />
      <PaymentPage />
    </PaymentProvider>
  );
}

Payment.Layout = DefaultLayout;
