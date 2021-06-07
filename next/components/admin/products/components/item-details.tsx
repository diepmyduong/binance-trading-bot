import cloneDeep from "lodash/cloneDeep";
import { useEffect, useState } from "react";
import { BsInbox } from "react-icons/bs";
import { RiAddLine, RiCloseLine } from "react-icons/ri";
import { useToast } from "../../../../lib/providers/toast-provider";
import { Category, CategoryService } from "../../../../lib/repo/category.repo";
import { Product, ProductService } from "../../../../lib/repo/product.repo";
import { Button } from "../../../shared/utilities/form/button";
import { Checkbox } from "../../../shared/utilities/form/checkbox";
import { Editor } from "../../../shared/utilities/form/editor";
import { Field } from "../../../shared/utilities/form/field";
import { Form } from "../../../shared/utilities/form/form";
import { FormValidator } from "../../../shared/utilities/form/form-validator";
import { ImageInput } from "../../../shared/utilities/form/image-input";
import { Input } from "../../../shared/utilities/form/input";
import { NotFound } from "../../../shared/utilities/not-found";
import { Spinner } from "../../../shared/utilities/spinner";
import { useProductsContext } from "../providers/products-provider";

interface PropsType extends ReactProps {}

export function ItemDetails({ ...props }: PropsType) {
  const { selectedItem } = useProductsContext();
  const [item, setItem] = useState<Category | Product>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedItem) {
      setLoading(true);
      if (selectedItem.categoryId) {
        ProductService.getOne({ id: selectedItem.id }).then((res) => {
          if (selectedItem?.id == res?.id) {
            setItem(cloneDeep(res));
            setLoading(false);
          }
        });
      } else {
        CategoryService.getOne({ id: selectedItem.id }).then((res) => {
          if (selectedItem?.id == res?.id) {
            setItem(cloneDeep(res));
            setLoading(false);
          }
        });
      }
    } else {
      setItem(null);
      setLoading(false);
    }
  }, [selectedItem]);

  return (
    <div className="p-4">
      {loading ? (
        <Spinner className="py-12" />
      ) : (
        <>
          {item ? (
            <>
              {item.categoryId ? (
                <ProductForm item={item as Product} setItem={setItem} />
              ) : (
                <CategoryForm item={item as Category} setItem={setItem} />
              )}
            </>
          ) : (
            <NotFound
              iconClassName="text-4xl mb-2"
              className="text-lg"
              icon={<BsInbox />}
              text="Chưa chọn danh mục/sản phẩm"
            />
          )}
        </>
      )}
    </div>
  );
}

function CategoryForm({ item, setItem }: { item: Category; setItem }) {
  const { setUpdatedItem } = useProductsContext();
  const toast = useToast();

  return (
    <Form
      grid
      initialData={item}
      className="max-w-lg animate-emerge-up"
      onSubmit={async (data) => {
        try {
          let res = await CategoryService.update({ id: item.id, data, toast });
          let newItem = cloneDeep(res);
          setItem(newItem);
          setUpdatedItem(newItem);
        } finally {
        }
      }}
    >
      <div className="text-primary mb-2 uppercase text-lg col-span-12 font-bold">
        Cập nhật {CategoryService.displayName}
      </div>
      <Field label="Tên danh mục sản phẩm" name="name" cols={8} required>
        <Input autoFocus />
      </Field>
      <Field
        label="Mã danh mục"
        name="code"
        cols={4}
        required
        validate={FormValidator.instance.key().build()}
      >
        <Input />
      </Field>
      <Field label="Tỉ lệ lời" name="profitRate" cols={5}>
        <Input number decimal currency="%" />
      </Field>
      <Field label=" " name="agency" cols={7}>
        <Checkbox placeholder="Danh mục chi phí agency" />
      </Field>
      <Field label="Thuộc tính" name="properties" cols={12}>
        <Input multi />
      </Field>
      <Form.Footer>
        <Form.ButtonGroup
          cancelText="Huỷ thay đổi"
          submitText={`Cập nhật ${CategoryService.displayName}`}
        />
      </Form.Footer>
    </Form>
  );
}

function ProductForm({ item, setItem }: { item: Product; setItem }) {
  const [params, setParams] = useState<{ value: string; label: string }[]>(null);
  const { setUpdatedItem } = useProductsContext();
  const toast = useToast();

  useEffect(() => {
    setParams(item ? cloneDeep(item.params) : null);
  }, [item]);

  useEffect(() => {
    if (params && !params[params.length - 1]?.label) {
      setTimeout(() => {
        let el = document.getElementById(`params-${params.length - 1}`);
        if (el) el.focus();
      });
    }
  }, [params]);

  return (
    <Form
      grid
      initialData={item}
      className="max-w-2xl animate-emerge-up"
      onReset={() => {
        setParams(cloneDeep(item.params));
      }}
      onSubmit={async (data) => {
        try {
          let res = await ProductService.update({
            id: item.id,
            data: {
              ...data,
              params: params.map((x) => ({ label: x.label, value: x.value })),
            },
            toast,
          });
          let newItem = cloneDeep(res);
          setItem(newItem);
          setUpdatedItem(newItem);
        } finally {
        }
      }}
    >
      <div className="text-primary mb-2 uppercase text-lg col-span-12 font-bold">
        Cập nhật {ProductService.displayName}
      </div>
      <Field label="Tên sản phẩm" name="name" cols={8} required>
        <Input autoFocus />
      </Field>
      <Field
        label="Mã sản phẩm"
        name="code"
        cols={4}
        required
        validate={FormValidator.instance.key().build()}
      >
        <Input />
      </Field>
      <Field label="Đơn vị tính" name="unit" cols={4}>
        <Input />
      </Field>
      <Field label="Giá gốc" name="basePrice" cols={4}>
        <Input number currency />
      </Field>
      <Field label="Tỉ lệ lời" name="profitRate" cols={4}>
        <Input number decimal currency="%" />
      </Field>
      <Field label="Mô tả ngắn" name="shortDesc" cols={12}>
        <Input />
      </Field>
      <Field label="Hình ảnh" name="images" cols={12}>
        <ImageInput multi cover />
      </Field>
      <Field label="Link Youtube" name="youtubeLink" cols={12}>
        <Input type="url" />
      </Field>
      <Field label="Nội dung" name="description" cols={12}>
        <Editor maxHeight="550px" />
      </Field>
      <Form.Consumer>
        {({ loading }) => (
          <Field label="Thông số" cols={12}>
            {params && (
              <table className="table-view">
                <tbody>
                  {params.map((param, index) => (
                    <tr key={index}>
                      <td className="w-1/3">
                        <Input
                          id={`params-${index}`}
                          className="h-9 border-0 rounded-none min-w-none"
                          placeholder="Tên thông số"
                          value={param.label}
                          readonly={loading}
                          onChange={(val) => {
                            param.label = val;
                          }}
                        />
                      </td>
                      <td>
                        <Input
                          className="h-9 border-0 rounded-none group"
                          placeholder="Nội dung thông số"
                          value={param.value}
                          readonly={loading}
                          onChange={(val) => {
                            param.value = val;
                          }}
                          suffix={
                            <Button
                              outline
                              hoverDanger
                              className="opacity-0 group-hover:opacity-100 px-0 w-6 h-6 rounded-full absolute -right-2 top-1/2 transform -translate-y-1/2 bg-white"
                              icon={<RiCloseLine />}
                              onClick={() => {
                                params.splice(index, 1);
                                setParams([...params]);
                              }}
                            />
                          }
                        />
                      </td>
                    </tr>
                  ))}
                  {!params.length && (
                    <tr>
                      <td className="h-9 text-center text-gray" colSpan={2}>
                        Chưa có thông số nào
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan={2}>
                      <Button
                        className="h-9 w-full"
                        icon={<RiAddLine />}
                        text="Thêm thông số"
                        disabled={loading}
                        onClick={() => {
                          setParams([...params, { label: "", value: "" }]);
                        }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </Field>
        )}
      </Form.Consumer>

      <Form.Footer>
        <Form.ButtonGroup
          cancelText="Huỷ thay đổi"
          submitText={`Cập nhật ${ProductService.displayName}`}
        />
      </Form.Footer>
    </Form>
  );
}
