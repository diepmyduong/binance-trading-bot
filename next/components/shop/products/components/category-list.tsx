import { useRef, useState } from "react";
import { RiMoreFill } from "react-icons/ri";
import { useAlert } from "../../../../lib/providers/alert-provider";
import { Category } from "../../../../lib/repo/category.repo";
import { Product } from "../../../../lib/repo/product.repo";
import { Button } from "../../../shared/utilities/form/button";
import { NotFound } from "../../../shared/utilities/not-found";
import { Dropdown } from "../../../shared/utilities/popover/dropdown";
import { Spinner } from "../../../shared/utilities/spinner";
import { useProductsContext } from "../providers/products-provider";
import { ProductForm } from "./product-form";
import { ProductItem } from "./product-item";

interface PropsType extends ReactProps {
  onEditClick: (category: Category) => any;
}
export function CategoryList({ onEditClick, ...props }: PropsType) {
  const { categories, removeCategory, onDeleteProduct, onToggleProduct } = useProductsContext();
  const [openProduct, setOpenProduct] = useState<{ product: Product; category: Category }>(
    undefined
  );
  const ref = useRef();
  const alert = useAlert();

  if (!categories) return <Spinner />;
  if (!categories.length) return <NotFound text="Chưa có danh mục nào" />;
  return (
    <>
      {categories.map((category, index) => (
        <div className="mt-4 mb-8" key={category.id}>
          <div className="flex pl-0.5 pb-3">
            <h5 className="text-gray-700 font-bold text-xl">{category.name}</h5>
            <span className="pl-2 pt-1 text-sm text-gray-400">(Ưu tiên: {category.priority})</span>
            <Button className="h-8" icon={<RiMoreFill />} iconClassName="text-xl" innerRef={ref} />
            <Dropdown reference={ref} placement="bottom-start">
              <Dropdown.Item text="Chỉnh sửa danh mục" onClick={() => onEditClick(category)} />
              <Dropdown.Item
                hoverDanger
                text="Xoá danh mục"
                onClick={() => removeCategory(category)}
              />
            </Dropdown>
          </div>
          {category.products.map((product) => (
            <ProductItem
              key={product.id}
              product={product}
              onClick={() => {
                setOpenProduct({ product, category });
              }}
              onToggleClick={async () => {
                onToggleProduct(product, category);
              }}
              onDeleteClick={async () => {
                if (!(await alert.danger(`Xoá món "${product.name}"`, "", "Xoá món"))) return;
                await onDeleteProduct(product, category);
              }}
            />
          ))}
          <Button
            className="bg-white h-12"
            outline
            primary
            text="Thêm món mới"
            onClick={() => {
              setOpenProduct({ product: null, category });
            }}
          />
        </div>
      ))}
      <ProductForm
        product={openProduct?.product}
        category={openProduct?.category}
        isOpen={openProduct !== undefined}
        onClose={() => setOpenProduct(undefined)}
      />
    </>
  );
}
