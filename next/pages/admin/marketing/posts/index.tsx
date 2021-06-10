import { PostPage } from "../../../../components/admin/marketing/post/post-page";
import { AdminLayout } from "../../../../layouts/admin-layout/admin-layout";

export default function Page() {
  return (
    <>
      <PostPage />
    </>
  );
}
Page.Layout = AdminLayout;
