import { NextSeo } from "next-seo";
import LoginPage from "../../components/admin/login/login-page";

export default function Page() {
  return (
    <>
      <NextSeo title="Đăng nhập Admin" />
      <LoginPage />
    </>
  );
}
