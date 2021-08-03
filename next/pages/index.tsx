import { useRouter } from "next/router";
import { useEffect } from "react";
import { ShopsPage } from "../components/index/shops/shops-page";
import { NextSeo } from "next-seo";

export default function Page(props) {
  return (
    <>
      <NextSeo title="Trang chủ" />
      <ShopsPage />
    </>
  );
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
