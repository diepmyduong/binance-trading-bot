import { useEffect, useRef, useState } from "react";
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
import { Button, ButtonProps } from "../../../shared/utilities/form/button";
import { RiAddCircleLine, RiAddLine, RiCloseLine, RiStarFill } from "react-icons/ri";
import { Product, ProductService } from "../../../../lib/repo/product.repo";
import { Category } from "../../../../lib/repo/category.repo";
import { useProductsContext } from "../providers/products-provider";
import { ImageInput } from "../../../shared/utilities/form/image-input";
import { Popover } from "../../../shared/utilities/popover/popover";
import { ToppingSelection } from "./topping-selection";
import { NumberPipe } from "../../../../lib/pipes/number";

interface PropsType extends DialogPropsType {
  product: Product;
  category: Category;
}
export function ProductForm({ product, category, ...props }: PropsType) {
  const toast = useToast();
  const { onProductChange } = useProductsContext();
  const ref = useRef();
  const [toppings, setToppings] = useState<ProductTopping[]>(null);

  useEffect(() => {
    setToppings(cloneDeep(product?.toppings || []));
  }, [product]);

  const onToppingSelect = (topping: ProductTopping) => {
    setToppings([...toppings, topping]);
  };

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
            data: {
              ...data,
              ...(product?.id
                ? {
                    toppings: toppings.map((x) => ({
                      name: x.name,
                      required: x.required,
                      min: x.min,
                      max: x.max,
                      options: x.options.map((y) => ({
                        name: y.name,
                        price: y.price,
                        isDefault: y.isDefault,
                      })),
                    })),
                  }
                : {}),
              categoryId: category.id,
            },
            toast,
          });
          onProductChange(res, category);
          props.onClose();
        } catch (err) {}
      }}
    >
      <div
        className="col-span-12 grid grid-cols-12 gap-x-5 v-scrollbar border-b border-gray-300 -m-4 mb-2 p-4"
        style={{ maxHeight: "calc(90vh - 100px)" }}
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
            <FormConsumer>
              {({ data }) => (
                <Field name="rating" label="Đánh giá" constraints={{ min: 0, max: 5 }} cols={8}>
                  <Input
                    number
                    decimal
                    suffix={
                      <div className="flex mr-2">
                        {[1, 2, 3, 4, 5].map((star) => {
                          let width = "0";
                          const rest = data.rating - star + 1;
                          if (rest >= 1) {
                            width = "100%";
                          } else if (rest > 0) {
                            let percent = rest * 100 + 2;
                            width = (percent > 100 ? 100 : percent) + "%";
                          }
                          return (
                            <div className="mr-2 relative" key={star}>
                              <i className="text-xl text-gray-400">
                                <RiStarFill />
                              </i>
                              <i
                                className="absolute top-0 left-0 h-full text-xl text-yellow-400 overflow-hidden"
                                style={{ width }}
                              >
                                <RiStarFill />
                              </i>
                            </div>
                          );
                        })}
                      </div>
                    }
                  />
                </Field>
              )}
            </FormConsumer>
            <Field name="soldQty" label="Đã bán" cols={4}>
              <Input number />
            </Field>
            <div className="col-span-12">
              <Label
                text="Danh sách topping"
                description="Chọn topping từ mẫu và chỉnh sửa lại cho phù hợp"
              />
              {toppings?.map((topping, index) => (
                <div className="mt-3" key={index}>
                  <div className="flex border-group rounded">
                    <Input
                      prefix="Tên"
                      prefixClassName="border-r border-gray-400 bg-gray-100 text-gray-600"
                      className="flex-1"
                      value={topping.name}
                      onChange={(name) => {
                        toppings[index].name = name;
                        setToppings([...toppings]);
                      }}
                    />
                    <Input
                      prefix="Tối thiểu"
                      prefixClassName="border-r border-gray-400 bg-gray-100 text-gray-600"
                      className="w-36"
                      number
                      value={topping.min}
                      onChange={(val, min) => {
                        toppings[index].min = min;
                        setToppings([...toppings]);
                      }}
                    />
                    <Input
                      prefix="Tối đa"
                      prefixClassName="border-r border-gray-400 bg-gray-100 text-gray-600"
                      className="w-36"
                      number
                      value={topping.max}
                      onChange={(val, max) => {
                        toppings[index].max = max;
                        setToppings([...toppings]);
                      }}
                    />
                    <Button
                      outline
                      icon={<RiCloseLine />}
                      hoverDanger
                      className="bg-gray-100 px-2"
                      onClick={() => {
                        toppings.splice(index, 1);
                        setToppings([...toppings]);
                      }}
                    />
                  </div>
                  <div className="text-gray-600 text-sm p-2 pt-1 pb-0">
                    {topping.options
                      .map((option) => `${option.name} ${NumberPipe(option.price, true)}`)
                      .join(", ")}
                  </div>
                </div>
              ))}
              <Button
                className="mt-3"
                outline
                textPrimary
                icon={<RiAddCircleLine />}
                text="Chọn mẫu topping"
                innerRef={ref}
              />
              <Popover reference={ref} trigger="click" arrow={true} placement="top-start">
                <ToppingSelection
                  onToppingSelect={(topping) => {
                    onToppingSelect(topping);
                    (ref.current as any)?._tippy.hide();
                  }}
                />
              </Popover>
            </div>
          </>
        )}
      </div>
      <Form.Footer>
        <Form.ButtonGroup submitText={`${product ? "Chỉnh sửa" : "Thêm"} món`} />
      </Form.Footer>
    </Form>
  );
}
