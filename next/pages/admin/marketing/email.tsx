import EmailMarketingPage from "../../../components/admin/marketing/email/email-page";
import { AdminLayout } from "../../../layouts/admin-layout/admin-layout";

export default function EmailMarketing() {
  return (
    <div className="">
      <EmailMarketingPage />
    </div>
  );
}

EmailMarketing.Layout = AdminLayout;
