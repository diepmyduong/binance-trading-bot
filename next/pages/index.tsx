import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Page(props) {
  const router = useRouter();
  useEffect(() => {
    const shopCode = localStorage.getItem("shopCode");
    router.replace(`/${shopCode || "404"}`);
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
