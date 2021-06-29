import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import { Homepage } from "../components/index/homepage/homepage";
import { DefaultLayout } from "../layouts/default-layout/default-layout";
import { Redirect } from "../lib/helpers/redirect";
import { MemberModel } from "../../dist/graphql/modules/member/member.model";
import NotFoundShop from "../components/index/not-found-shop/not-found-shop";
import { NoneLayout } from "../layouts/none-layout/none-layout";

export default function Page(props) {
  return (
    (props.notFound && (
      <NoneLayout>
        <NextSeo title={`Không tìm thấy cửa hàng`} />
        <NotFoundShop />
      </NoneLayout>
    )) || (
      <DefaultLayout code={props.code} shop={props.shop}>
        <NextSeo title={`Trang chủ`} />
        <Homepage productId={props.productId} />
      </DefaultLayout>
    )
  );
}
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
