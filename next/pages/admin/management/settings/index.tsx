import { SettingsPage } from "../../../../components/admin/management/settings/settings-page";
import { AdminLayout } from "../../../../layouts/admin-layout/admin-layout";

export default function Page() {
  return (
    <>
      <SettingsPage />
    </>
  );
}
Page.Layout = AdminLayout;
