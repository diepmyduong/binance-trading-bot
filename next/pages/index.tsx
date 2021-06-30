import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import { Homepage } from "../components/index/homepage/homepage";
import { DefaultLayout } from "../layouts/default-layout/default-layout";
import { Redirect } from "../lib/helpers/redirect";
import { MemberModel } from "../../dist/graphql/modules/member/member.model";
import NotFoundShop from "../components/index/not-found-shop/not-found-shop";
import { NoneLayout } from "../layouts/none-layout/none-layout";
import { HomeProvider } from "../components/index/homepage/providers/homepage-provider";
import { useEffect } from "react";

export default function Page(props) {
  useEffect(() => {
    sessionStorage.setItem("shop", JSON.stringify(props.shop));
    sessionStorage.setItem("shopCode", props.code);
  }, []);
  return (
    (props.notFound && (
      <>
        <NextSeo title={`Không tìm thấy cửa hàng`} />
        <NotFoundShop />
      </>
    )) || (
      <>
        <HomeProvider code={props.code} shop={props.shop}>
          <NextSeo title={`Trang chủ`} />
          <Homepage productId={props.productId} />
        </HomeProvider>
      </>
    )
  );
}
Page.Layout = DefaultLayout;
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { code = "3MSHOP", productId } = context.query;
  console.log(productId);
  let notFound = false;
  // if (!code) Redirect(context.res, "/404");
  const shop = await MemberModel.findOne({ code }, "shopName shopLogo");
  if (!shop) {
    notFound = true;
  }
  return {
    props: JSON.parse(
      JSON.stringify({
        notFound,
        code,
        productId,
        shop,
      })
    ),
  };
}
