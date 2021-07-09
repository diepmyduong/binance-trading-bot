import { NextSeo } from "next-seo";
import { CommentsPage } from "../../components/shop/comments/comments-page";
import { ShopLayout } from "../../layouts/shop-layout/shop-layout";

export default function Page() {
  return (
    <>
      <NextSeo title="Bình luận" />
      <CommentsPage />
    </>
  );
}

Page.Layout = ShopLayout;
