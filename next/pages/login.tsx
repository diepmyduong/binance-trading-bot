import { NextSeo } from "next-seo";
import { LoginPage } from "../components/index/auth/login/login-page";

export default function Login() {
  return (
    <>
      <NextSeo title="Đăng nhập" />
      <LoginPage />
    </>
  );
}
