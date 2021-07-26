import { NextSeo } from "next-seo";
import { NotFoundShop } from "../components/index/not-found-shop/not-found-shop";

export default function Login() {
  return (
    <>
      <NextSeo title="Không tìm thấy cửa hàng" />
      <NotFoundShop />
    </>
  );
}
