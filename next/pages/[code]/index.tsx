import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import { Homepage } from "../../components/index/homepage/homepage";
import { HomeProvider } from "../../components/index/homepage/providers/homepage-provider";
import { DefaultLayout } from "../../layouts/default-layout/default-layout";
import { Redirect } from "../../lib/helpers/redirect";
import SEO from "../../lib/helpers/seo";
import { MemberModel } from "./../../../dist/graphql/modules/member/member.model";

export default function Page(props) {
  return (
    <>
      <HomeProvider code={props.code} shop={props.shop}>
        <NextSeo {...props.seo} />
        <Homepage />
      </HomeProvider>
    </>
  );
}
Page.Layout = DefaultLayout;
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { product } = context.query;
  const { code = "3MSHOP" } = context.params;
  const shop = await MemberModel.findOne({ code }, "shopName shopLogo shopCover");
  if (!shop) {
    Redirect(context.res, `/not-found-shop`);
  }
  const seo = await SEO("Cửa hàng", {
    image: shop.shopCover,
    description: shop.shopName,
    shopName: shop.shopName,
  });
  return {
    props: JSON.parse(
      JSON.stringify({
        code,
        shop,
        seo,
      })
    ),
  };
}
