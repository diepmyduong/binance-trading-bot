import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import { Homepage } from "../components/index/homepage/homepage";
import { DefaultLayout } from "../layouts/default-layout/default-layout";
import { MemberModel } from "../../dist/graphql/modules/member/member.model";
import { HomeProvider } from "../components/index/homepage/providers/homepage-provider";
import { useEffect } from "react";
<<<<<<< HEAD
import { Redirect } from "../lib/helpers/redirect";
=======
import { ProductDetailProvider } from "../components/shop/product-detail/provider/product-detail-provider";
>>>>>>> e1ea4747c00212ff237ed16fc2bd4c9d32338774

export default function Page(props) {
  useEffect(() => {
    sessionStorage.setItem("shop", JSON.stringify(props.shop));
    sessionStorage.setItem("shopCode", props.code);
  }, []);
  return (
<<<<<<< HEAD
    <>
      <HomeProvider code={props.code} shop={props.shop}>
        <NextSeo title={`Trang chủ`} />
        <Homepage productId={props.productId} />
      </HomeProvider>
    </>
=======
    (props.notFound && (
      <>
        <NextSeo title={`Không tìm thấy cửa hàng`} />
        <NotFoundShop />
      </>
    )) || (
      <>
        <HomeProvider code={props.code} shop={props.shop}>
          <ProductDetailProvider productId={props.productId}>
            <NextSeo title={`Trang chủ`} />
            <Homepage productId={props.productId} />
          </ProductDetailProvider>
        </HomeProvider>
      </>
    )
>>>>>>> e1ea4747c00212ff237ed16fc2bd4c9d32338774
  );
}
Page.Layout = DefaultLayout;
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { code = "3MSHOP", productId } = context.query;
  console.log(productId);
  const shop = await MemberModel.findOne({ code }, "shopName shopLogo");
  if (!shop) {
    Redirect(context.res, "/not-found-shop");
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
