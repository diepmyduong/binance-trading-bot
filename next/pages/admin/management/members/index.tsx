import { MembersPage } from "../../../../components/admin/management/members/members-page";
import { AdminLayout } from "../../../../layouts/admin-layout/admin-layout";

export default function Page() {
  return (
    <>
      <MembersPage />
    </>
  );
}
Page.Layout = AdminLayout;
