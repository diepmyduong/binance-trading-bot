import { NextSeo } from "next-seo";
import { ListNewsPage } from "../components/index/list-news/news-page";
import { DefaultLayout } from "../layouts/default-layout/default-layout";

export default function Page() {
  return (
    <>
      <NextSeo title="Tin tức" />
      <ListNewsPage />
    </>
  );
}

Page.Layout = DefaultLayout;
