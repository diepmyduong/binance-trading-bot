import { WIP } from "../../components/shared/utilities/wip";
import { DashboardPage } from "../../components/shop/dashboard/dashboard-page";
import { ShopLayout } from "../../layouts/shop-layout/shop-layout";

export default function Page() {
  return (
    <>
      <DashboardPage />
    </>
  );
}

Page.Layout = ShopLayout;
