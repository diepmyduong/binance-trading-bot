import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import { OrderDetailPage } from "../../components/index/order-detail/order-detail-page";
import { DefaultLayout } from "../../layouts/default-layout/default-layout";

export default function Page(props) {
  return (
    <>
      <NextSeo title="Chi tiết đơn hàng" />
      <OrderDetailPage />
    </>
  );
}

Page.Layout = DefaultLayout;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { code } = context.query;
  return {
    props: JSON.parse(
      JSON.stringify({
        code,
      })
    ),
  };
}
