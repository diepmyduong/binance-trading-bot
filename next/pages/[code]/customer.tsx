import React from "react";
import { DefaultLayout } from "../../layouts/default-layout/default-layout";
import { NextSeo } from "next-seo";
import { CustomerPage } from "../../components/index/customer/customer-page";
import { GetServerSidePropsContext } from "next";
import { Redirect } from "../../lib/helpers/redirect";
import SEO from "../../lib/helpers/seo";

export default function Page(props) {
  return (
    <>
      <NextSeo {...props.seo} />
      <CustomerPage />
    </>
  );
}

Page.Layout = DefaultLayout;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { code = "3MSHOP" } = context.params;
  const shop = null;
  if (!shop) {
    Redirect(context.res, `/not-found-shop`);
  }
  const seo = await SEO("Tài khoản", {
    image: shop.shopCover || shop.shopLogo,
    description: shop.shopName,
    shopName: shop.shopName,
  });
  return {
    props: JSON.parse(
      JSON.stringify({
        seo,
      })
    ),
  };
}
