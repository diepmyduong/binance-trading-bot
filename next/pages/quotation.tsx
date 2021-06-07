import { NextSeo } from "next-seo";
import { QuotationPage } from "../components/index/quotation/quotation-page";
import { DefaultLayout } from "../layouts/default-layout/default-layout";

export default function Page() {
  return (
    <>
      <NextSeo title="Báo giá" />
      <QuotationPage />
    </>
  );
}

Page.Layout = DefaultLayout;
