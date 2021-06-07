import { NextSeo } from "next-seo";
import { useEffect } from "react";
import { Homepage } from "../components/index/homepage/homepage";
import { DefaultLayout } from "../layouts/default-layout/default-layout";
import { useAuth } from "../lib/providers/auth-provider";

export default function Page() {
  return (
    <>
      <NextSeo title="Trang chủ" />
      <Homepage />
    </>
  );
}

Page.Layout = DefaultLayout;
