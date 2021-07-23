import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import { PaymentPage } from "../../components/index/payment/payment-page";
import { PaymentProvider } from "../../components/index/payment/providers/payment-provider";
import { DefaultLayout } from "../../layouts/default-layout/default-layout";
import { Redirect } from "../../lib/helpers/redirect";
import SEO from "../../lib/helpers/seo";
import { MemberModel } from "./../../../dist/graphql/modules/member/member.model";

export default function Payment(props) {
  return (
    <PaymentProvider>
      <NextSeo {...props.seo} />
      <PaymentPage />
    </PaymentProvider>
  );
}

Payment.Layout = DefaultLayout;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { code = "3MSHOP" } = context.params;
  const shop = await MemberModel.findOne({ code }, "shopName shopLogo shopCover");
  if (!shop) {
    Redirect(context.res, `/not-found-shop`);
  }
  const seo = await SEO("Thanh toán", {
    image: shop.shopCover,
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
