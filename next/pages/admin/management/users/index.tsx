import { UserPage } from "../../../../components/admin/management/users/user-page";
import { AdminLayout } from "../../../../layouts/admin-layout/admin-layout";

export default function Page() {
  return (
    <>
      <UserPage />
    </>
  );
}
Page.Layout = AdminLayout;
