import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { ShopsPage } from "../components/index/shops/shops-page";

export default function Page(props) {
  const router = useRouter();
  router.push("/admin");
}
