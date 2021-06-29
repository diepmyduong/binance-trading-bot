import { useRouter } from "next/router";
import { useEffect } from "react";
import { ShopLayout } from "../../layouts/shop-layout/shop-layout";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/shop/settings");
  });
  return null;
}

Page.Layout = ShopLayout;
