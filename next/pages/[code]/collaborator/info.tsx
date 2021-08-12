import { NextSeo } from "next-seo";
import { DefaultLayout } from "../../../layouts/default-layout/default-layout";
import { Redirect } from "../../../lib/helpers/redirect";
import SEO from "../../../lib/helpers/seo";
import { GetServerSidePropsContext } from "next";
import { InfoPage } from "../../../components/index/collaborator/info/info-page";

export default function Page(props) {
  return (
    <>
      <NextSeo {...props.seo} />
      <InfoPage />
    </>
  );
}

Page.Layout = DefaultLayout;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { code = "3MSHOP" } = context.params;
  const shop = null;
  if (!shop) {
    Redirect(context.res, `/not-found-shop`);
  }
  const seo = await SEO("Thống kê CTV", {
    image: shop.shopCover || shop.shopLogo,
    description: shop.shopName,
    shopName: shop.shopName,
  });
  return {
    props: JSON.parse(
      JSON.stringify({
        seo,
      })
    ),
  };
}
