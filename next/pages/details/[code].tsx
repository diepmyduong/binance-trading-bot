import { NextSeo } from "next-seo";
import { Redirect } from "../../lib/helpers/redirect";
import { ProductModel } from "../../../dist/graphql/modules/product/product.model";
import DetailPage from "../../components/index/detail/details-page";
import { DefaultLayout } from "../../layouts/default-layout/default-layout";
import { DetailsProvider } from "../../components/index/detail/providers/details-provider";
import { GetServerSidePropsContext } from "next";
import SEO from "../../lib/helpers/seo";
import { useEffect } from "react";
interface PropsType extends ReactProps {
  id: string;
  title: string;
}
export default function Page(props: PropsType) {
  return (
    <>
      <NextSeo title={props.title} />
      <DetailsProvider productId={props.id}>
        <DetailPage />
      </DetailsProvider>
    </>
  );
}

Page.Layout = DefaultLayout;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { code } = context.params;
  const product = await ProductModel.findOne({ code }, "_id name shortDesc");

  if (!product) Redirect(context.res, "/404");
  // const seo = await SEO(product.name, {
  //   description: product.shortDesc,
  // });
  // console.log(seo);

  return {
    props: JSON.parse(
      JSON.stringify({
        id: product.id,
        title: product.name,
      })
    ),
  };
}
