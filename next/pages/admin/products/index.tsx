import { AdminLayout } from "../../../layouts/admin-layout/admin-layout";
import { ProductsPage } from "../../../components/admin/products/products-page";

export default function Page() {
  return (
    <>
      <ProductsPage />
    </>
  );
}
Page.Layout = AdminLayout;
