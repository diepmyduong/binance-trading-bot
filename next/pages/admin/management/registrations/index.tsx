import { RegistrationsPage } from "../../../../components/admin/management/registrations/registrations-page";
import { AdminLayout } from "../../../../layouts/admin-layout/admin-layout";

export default function Page() {
  return (
    <>
      <RegistrationsPage />
    </>
  );
}
Page.Layout = AdminLayout;
