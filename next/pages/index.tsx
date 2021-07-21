import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import { Homepage } from "../components/index/homepage/homepage";
import { DefaultLayout } from "../layouts/default-layout/default-layout";
import { useEffect } from "react";
import { Redirect } from "../lib/helpers/redirect";
import { HomeProvider } from "../components/index/homepage/providers/homepage-provider";
import { useRouter } from "next/router";

export default function Page(props) {
  const router = useRouter();

  useEffect(() => {
    router.replace("/3MSHOP/");
  });
  return null;
  // useEffect(() => {
  //   sessionStorage.setItem("shop", JSON.stringify(props.shop));
  //   sessionStorage.setItem("shopCode", props.code);
  // }, []);

  // return (
  //   <>
  //     <HomeProvider code={props.code} shop={props.shop}>
  //       <NextSeo title={`Trang chủ`} />
  //       <Homepage />
  //     </HomeProvider>
  //   </>
  // );
}
// Page.Layout = DefaultLayout;
// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   const { code = "3MSHOP", productId } = context.query;
//   console.log(productId);
//   const shop = await MemberModel.findOne({ code }, "shopName shopLogo");
//   if (!shop) {
//     Redirect(context.res, "/not-found-shop");
//   }
//   return {
//     props: JSON.parse(
//       JSON.stringify({
//         code,
//         productId,
//         shop,
//       })
//     ),
//   };
// }
