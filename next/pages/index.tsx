import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import { Homepage } from "../components/index/homepage/homepage";
import { DefaultLayout } from "../layouts/default-layout/default-layout";
import { useRouter } from "next/router";
import { Redirect } from "../lib/helpers/redirect";
import { MemberModel } from "../../dist/graphql/modules/member/member.model";

export default function Page(props) {
  const router = useRouter();
  return (
    <>
      <NextSeo title={`Trang chủ | ${props.shopName}`} />
      <Homepage />
    </>
  );
}

Page.Layout = DefaultLayout;
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { code } = context.query;
  if (!code) Redirect(context.res, "/404");
  const shop = await MemberModel.findOne({ code: code as string }, "_id shopName");
  const { id, shopName } = shop;
  return {
    props: JSON.parse(
      JSON.stringify({
        shopName,
        code,
      })
    ),
  };
}
