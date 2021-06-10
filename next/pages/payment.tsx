import { NextSeo } from "next-seo";
import { PaymentPage } from "../components/index/payment/payment-page";
import { DefaultLayout } from "../layouts/default-layout/default-layout";

export default function Payment() {
  return (
    <div className="">
      <NextSeo title="Thanh toán" />
      <PaymentPage />
    </div>
  );
}

Payment.Layout = DefaultLayout;
