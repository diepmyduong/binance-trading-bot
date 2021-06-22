import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import { Homepage } from "../components/index/homepage/homepage";
import { DefaultLayout } from "../layouts/default-layout/default-layout";
import { Redirect } from "../lib/helpers/redirect";
import { MemberModel } from "../../dist/graphql/modules/member/member.model";

export default function Page(props) {
  return (
    <>
      <NextSeo title={`Trang chủ`} />
      <Homepage productId={props.productId} />
    </>
  );
}

Page.Layout = DefaultLayout;
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { code = "3MSHOP", productId } = context.query;
  console.log(productId);
  // if (!code) Redirect(context.res, "/404");
  const shop = await MemberModel.findOne({ code }, "shopName shopLogo");
  console.log(shop);
  if (!shop) Redirect(context.res, "/404");
  const { shopName, shopLogo } = shop;
  return {
    props: JSON.parse(
      JSON.stringify({
        code,
        productId,
        shopName,
        shopLogo,
      })
    ),
  };
}
