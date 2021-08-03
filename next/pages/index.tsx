import { useRouter } from "next/router";
import { useEffect } from "react";
import { ShopsPage } from "../components/index/shops/shops-page";
import { NextSeo } from "next-seo";

export default function Page(props) {
  return (
    <>
      <NextSeo title="Trang chủ" />
      <ShopsPage />
    </>
  );
}
