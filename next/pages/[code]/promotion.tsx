import { NextSeo } from "next-seo";
import React from "react";
import { DefaultLayout } from "../../layouts/default-layout/default-layout";
import PromotionsPage from "../../components/index/promotion/promotions-page";

export default function Promotion() {
  return (
    <div className="">
      <NextSeo title="Khuyến mãi" />
      <PromotionsPage />
    </div>
  );
}

Promotion.Layout = DefaultLayout;
