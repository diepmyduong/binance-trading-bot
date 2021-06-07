import { NextSeo } from "next-seo";
import { Redirect } from "../../lib/helpers/redirect";
import { DefaultLayout } from "../../layouts/default-layout/default-layout";
import { GetServerSidePropsContext } from "next";
import { CategoryProvider } from "../../components/index/categories/providers/category-provider";
import CategoryPage from "../../components/index/categories/category-page";
import { CategoryModel } from "../../../dist/graphql/modules/category/category.model";
interface PropsType extends ReactProps {
  id: string;
  title: string;
}
export default function Page(props: PropsType) {
  return (
    <>
      <NextSeo title={props.title} />
      <CategoryProvider categoryId={props.id}>
        <CategoryPage />
      </CategoryProvider>
    </>
  );
}

Page.Layout = DefaultLayout;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { code } = context.params;
  console.log(code);
  let category = null;
  if (code) category = await CategoryModel.findOne({ code }, "_id name");
  console.log(category);
  if (!category) Redirect(context.res, "/404");
  // // const seo = await SEO(product.name, {
  // //   description: product.shortDesc,
  // // });
  // // console.log(seo);

  return {
    props: JSON.parse(
      JSON.stringify({
        id: category.id,
        title: category.name,
      })
    ),
  };
}
