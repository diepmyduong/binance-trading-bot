import { useState } from "react";
import { useToast } from "../../../lib/providers/toast-provider";
import { Category, CategoryService } from "../../../lib/repo/category.repo";
import { ShopPageTitle } from "../../shared/shop-layout/shop-page-title";
import { Button } from "../../shared/utilities/form/button";
import { Field } from "../../shared/utilities/form/field";
import { Form } from "../../shared/utilities/form/form";
import { Input } from "../../shared/utilities/form/input";
import { CategoryList } from "./components/category-list";
import { ProductsContext, ProductsProvider } from "./providers/branches-provider";

export function BranchesPage(props: ReactProps) {
  const [openCategory, setOpenCategory] = useState<Category>(undefined);
  const toast = useToast();

  return (
    <ProductsProvider>
      <div className="flex justify-between items-center pb-6 border-b border-gray-300">
        <ShopPageTitle
          title="Danh mục món"
          subtitle="Quản lý danh mục và các món ăn thuộc danh mục"
        />
        <Button
          primary
          className="bg-gradient h-12"
          text="Thêm danh mục"
          onClick={() => setOpenCategory(null)}
        />
      </div>
      <CategoryList onEditClick={(category) => setOpenCategory(category)} />
      <ProductsContext.Consumer>
        {({ loadCategories }) => (
          <Form
            grid
            dialog
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
              <Form.ButtonGroup submitText={`${openCategory ? "Chỉnh sửa" : "Thêm"} danh mục`} />
            </Form.Footer>
          </Form>
        )}
      </ProductsContext.Consumer>
    </ProductsProvider>
  );
}
