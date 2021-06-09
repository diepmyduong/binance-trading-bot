import { NextSeo } from "next-seo";
import { DefaultLayout } from "../../layouts/default-layout/default-layout";

export default function Page() {
  return (
    <>
      <NextSeo title="Đơn hàng của tôi" />
    </>
  );
}

Page.Layout = DefaultLayout;
