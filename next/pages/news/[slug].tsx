import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import { NewsPage } from "../../components/index/news/news-page";
import { DetailNewsProvider } from "../../components/index/news/provider/detail-news-provider";
import { DefaultLayout } from "../../layouts/default-layout/default-layout";
import { Redirect } from "../../lib/helpers/redirect";
// import { PostModel } from "../../../dist/graphql/modules/post/post.model";

export default function Page(props) {
  console.log("props,props", props);
  return (
    <>
      <DetailNewsProvider newsId={props.id}>
        <NextSeo title={props.title} />
        <NewsPage />
      </DetailNewsProvider>
    </>
  );
}

Page.Layout = DefaultLayout;

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   const { slug } = context.query;
//   // const post = await PostModel.findOne({ slug }, "_id title excerpt featureImage");
//   if (!post) Redirect(context.res, "/404");
//   return {
//     props: JSON.parse(
//       JSON.stringify({
//         id: post.id,
//         title: post.title,
//       })
//     ),
//   };
// }
