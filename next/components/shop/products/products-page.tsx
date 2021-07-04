import { useState } from "react";
import { HiOutlineRefresh } from "react-icons/hi";
import { useToast } from "../../../lib/providers/toast-provider";
import { Category, CategoryService } from "../../../lib/repo/category.repo";
import { ShopPageTitle } from "../../shared/shop-layout/shop-page-title";
import { Button } from "../../shared/utilities/form/button";
import { Field } from "../../shared/utilities/form/field";
import { Form } from "../../shared/utilities/form/form";
import { Input } from "../../shared/utilities/form/input";
import { CategoryList } from "./components/category-list";
import { ProductLabelTableDialog } from "./components/product-label-table-dialog";
import { ProductsContext, ProductsProvider } from "./providers/products-provider";

export function ProductsPage(props: ReactProps) {
  const [openCategory, setOpenCategory] = useState<Category>(undefined);
  const [openLabelTableDialog, setOpenLabelTableDialog] = useState(false);
  const toast = useToast();

  return (
    <>
      <ProductsProvider>
        <ProductsContext.Consumer>
          {({ loadCategories }) => (
            <>
              <div className="flex justify-between items-center pb-6 border-b border-gray-300">
                <ShopPageTitle
                  title="Danh mục món"
                  subtitle="Quản lý danh mục và các món ăn thuộc danh mục"
                />
                <div className="flex gap-x-2">
                  <Button
                    outline
                    className="h-12 bg-white"
                    text="Quản lý nhãn"
                    onClick={() => setOpenLabelTableDialog(true)}
                  />
                  <Button
                    outline
                    className="px-0 w-12 h-12 bg-white"
                    icon={<HiOutlineRefresh />}
                    iconClassName="text-xl"
                    onClick={() => loadCategories(true)}
                  />
                  <Button
                    primary
                    className="bg-gradient h-12"
                    text="Thêm danh mục"
                    onClick={() => setOpenCategory(null)}
                  />
                </div>
              </div>
              <CategoryList onEditClick={(category) => setOpenCategory(category)} />
              <Form
                grid
                dialog
                extraDialogClass="bg-transparent"
                extraHeaderClass="bg-gray-100 text-xl py-3 justify-center rounded-t-xl border-gray-300"
                extraBodyClass="px-6 bg-gray-100 rounded-b-xl"
                initialData={openCategory}
                title={`${openCategory ? "Chỉnh sửa" : "Thêm"} danh mục`}
                isOpen={openCategory !== undefined}
                onClose={() => setOpenCategory(undefined)}
                onSubmit={async (data) => {
                  try {
                    await CategoryService.createOrUpdate({ id: openCategory?.id, data, toast });
                    setOpenCategory(undefined);
                    loadCategories();
                  } catch (err) {}
                }}
              >
                <Field name="name" label="Tên danh mục" cols={8} required>
                  <Input />
                </Field>
                <Field name="priority" label="Độ ưu tiên" cols={4}>
                  <Input number defaultValue={1} />
                </Field>
                <Form.Footer>
                  <Form.ButtonGroup
                    submitText={`${openCategory ? "Chỉnh sửa" : "Thêm"} danh mục`}
                    className="justify-center"
                    cancelText=""
                    submitProps={{ className: "bg-gradient h-14 w-64" }}
                  />
                </Form.Footer>
              </Form>
            </>
          )}
        </ProductsContext.Consumer>
      </ProductsProvider>
      <ProductLabelTableDialog
        width="650px"
        isOpen={openLabelTableDialog}
        onClose={() => setOpenLabelTableDialog(false)}
      />
    </>
  );
}
