import { DefaultLayout } from "../../layouts/default-layout/default-layout";
import CategoryPage from "../../components/index/categories/category-page";
import React from "react";
import { CategoryProvider } from "../../components/index/categories/providers/category-provider";
import { NextSeo } from "next-seo";

export default function Page(props) {
  return (
    <>
      <NextSeo title="Trang danh sách hạng mục" />
      <CategoryProvider catagoryId={null}>
        <CategoryPage />
      </CategoryProvider>
    </>
  );
}

Page.Layout = DefaultLayout;
