import { ManagerPage } from "../../../components/admin/management/management-page";
import { AdminLayout } from "../../../layouts/admin-layout/admin-layout";

export default function Page() {
  return (
    <>
      <ManagerPage />
    </>
  );
}
Page.Layout = AdminLayout;
