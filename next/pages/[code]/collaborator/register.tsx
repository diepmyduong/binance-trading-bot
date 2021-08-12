import { NextSeo } from "next-seo";
import { DefaultLayout } from "../../../layouts/default-layout/default-layout";
import { Redirect } from "../../../lib/helpers/redirect";
import SEO from "../../../lib/helpers/seo";
import { GetServerSidePropsContext } from "next";
import { RegisterPage } from "../../../components/index/collaborator/register/register-page";

export default function Page(props) {
  return (
    <>
      <NextSeo {...props.seo} />
      <RegisterPage />
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
  const seo = await SEO("Đăng ký CTV", {
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
