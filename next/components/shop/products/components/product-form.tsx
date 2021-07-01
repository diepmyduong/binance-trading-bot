import { useEffect, useState } from "react";
import { useToast } from "../../../../lib/providers/toast-provider";
import { ProductTopping, ToppingOption } from "../../../../lib/repo/product-topping.repo";
import { DialogPropsType } from "../../../shared/utilities/dialog/dialog";
import { Form, FormConsumer } from "../../../shared/utilities/form/form";
import { DataTable } from "../../../shared/utilities/table/data-table";
import cloneDeep from "lodash/cloneDeep";
import { Field } from "../../../shared/utilities/form/field";
import { Input } from "../../../shared/utilities/form/input";
import { Switch } from "../../../shared/utilities/form/switch";
import { Label } from "../../../shared/utilities/form/label";
import { Button } from "../../../shared/utilities/form/button";
import { RiAddLine, RiCloseLine } from "react-icons/ri";
import { Product, ProductService } from "../../../../lib/repo/product.repo";
import { Category } from "../../../../lib/repo/category.repo";
import { useProductsContext } from "../providers/products-provider";
import { ImageInput } from "../../../shared/utilities/form/image-input";

interface PropsType extends DialogPropsType {
  product: Product;
  category: Category;
}
export function ProductForm({ product, category, ...props }: PropsType) {
  const toast = useToast();
  const { onProductChange } = useProductsContext();
  return (
    <Form
      grid
      dialog
      width="650px"
      initialData={product || {}}
      title={`${product ? "Chỉnh sửa" : "Thêm"} món`}
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={async (data) => {
        try {
          let res = await ProductService.createOrUpdate({
            id: product?.id,
            data: { ...data, categoryId: category.id },
            toast,
          });
          onProductChange(res, category);
          props.onClose();
        } catch (err) {}
      }}
    >
      <Field name="name" label="Tên món" cols={8} required>
        <Input />
      </Field>
      <Field name="code" label="Mã món" cols={4}>
        <Input placeholder="Tự tạo nếu để trống" />
      </Field>
      <Field name="basePrice" label="Giá bán" cols={6} required>
        <Input number currency />
      </Field>
      {product && (
        <>
          <Field name="downPrice" label="Giá giảm" cols={6}>
            <Input number currency />
          </Field>
          <Field
            name="image"
            label="Hình ảnh sản phẩm"
            description="Tỉ lệ ảnh khuyến nghị 1:1"
            cols={12}
          >
            <ImageInput />
          </Field>
          <Field name="subtitle" label="Mô tả ngắn" cols={12}>
            <Input />
          </Field>
        </>
      )}
      <Form.Footer>
        <Form.ButtonGroup submitText={`${product ? "Chỉnh sửa" : "Thêm"} món`} />
      </Form.Footer>
    </Form>
  );
}
