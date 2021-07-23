import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import { Homepage } from "../../components/index/homepage/homepage";
import { DefaultLayout } from "../../layouts/default-layout/default-layout";
import { MemberModel } from "./../../../dist/graphql/modules/member/member.model";
import { useEffect } from "react";
import { Redirect } from "../../lib/helpers/redirect";
import { HomeProvider } from "../../components/index/homepage/providers/homepage-provider";
import { ClearCustomerToken, ClearAnonymousToken } from "../../lib/graphql/auth.link";

export default function Page(props) {
  // useEffect(() => {
  //   sessionStorage.setItem("shop", JSON.stringify(props.shop));
  //   sessionStorage.setItem("shopCode", props.code);
  // }, []);

  return (
    <>
      <HomeProvider code={props.code} shop={props.shop}>
        <NextSeo title={`Trang chủ`} />
        <Homepage />
      </HomeProvider>
    </>
  );
}
Page.Layout = DefaultLayout;
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { productId } = context.query;
  const { code = "3MSHOP" } = context.params;
  console.log(productId);
  const shop = await MemberModel.findOne({ code }, "shopName shopLogo");
  if (!shop) {
    Redirect(context.res, `${code}/not-found-shop`);
  }
  return {
    props: JSON.parse(
      JSON.stringify({
        code,
        productId,
        shop,
      })
    ),
  };
}
