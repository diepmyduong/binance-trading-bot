import React from "react";
import { DefaultLayout } from "../../layouts/default-layout/default-layout";
import { NextSeo } from "next-seo";
import { CustomerPage } from "../../components/index/customer/customer-page";

export default function Page() {
  return (
    <>
      <NextSeo title={`Trang tài khoản`} />
      <CustomerPage />
    </>
  );
}

Page.Layout = DefaultLayout;
