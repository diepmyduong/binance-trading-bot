import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import { Homepage } from "../components/index/homepage/homepage";
import { DefaultLayout } from "../layouts/default-layout/default-layout";
import { Redirect } from "../lib/helpers/redirect";
import { MemberModel } from "../../dist/graphql/modules/member/member.model";

export default function Page(props) {
  // const router = useRouter();
  return (
    <>
      <NextSeo title={`Trang chủ`} />
      <Homepage />
    </>
  );
}

Page.Layout = DefaultLayout;
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { code = "3MSHOP" } = context.query;
  // if (!code) Redirect(context.res, "/404");
  const shop = await MemberModel.findOne({ code }, "shopName shopLogo");
  const { shopName, shopLogo } = shop;
  if (!shop) Redirect(context.res, "/404");
  return {
    props: JSON.parse(
      JSON.stringify({
        shopName,
        shopLogo,
      })
    ),
  };
}
