import { NextSeo } from "next-seo";
import { NotificationPage } from "../../components/index/notifcation/notification";
import { NotificationProvider } from "../../components/index/notifcation/provider/notification-provider";
import { DefaultLayout } from "../../layouts/default-layout/default-layout";

export default function Page() {
  return (
    <NotificationProvider>
      <NextSeo title="Thông báo" />
      <NotificationPage />
    </NotificationProvider>
  );
}

Page.Layout = DefaultLayout;
