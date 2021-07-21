import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import { OrderDetailPage } from "../../../components/index/order-detail/order-detail-page";
import { DefaultLayout } from "../../../layouts/default-layout/default-layout";
import { OrderModel } from "../../../../dist/graphql/modules/order/order.model";
import { Redirect } from "../../../lib/helpers/redirect";
import { OrderDetailProvider } from "../../../components/index/order-detail/providers/order-detail-provider";

export default function Page(props) {
  return (
    <OrderDetailProvider id={props.id}>
      <NextSeo title="Chi tiết đơn hàng" />
      <OrderDetailPage />
    </OrderDetailProvider>
  );
}

Page.Layout = DefaultLayout;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { order } = context.params;
  const orderDetail = await OrderModel.findOne({ code: order }, "_id");
  console.log(order);
  if (!order) Redirect(context.res, "/404");
  const { id } = orderDetail;
  return {
    props: JSON.parse(
      JSON.stringify({
        id,
      })
    ),
  };
}
