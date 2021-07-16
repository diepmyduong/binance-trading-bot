import cloneDeep from "lodash/cloneDeep";
import { useEffect, useRef, useState } from "react";
import {
  RiAddCircleLine,
  RiAddFill,
  RiArrowDownLine,
  RiArrowUpLine,
  RiCloseLine,
  RiDeleteBin6Line,
  RiImageAddFill,
  RiStarFill,
} from "react-icons/ri";
import { useToast } from "../../../../lib/providers/toast-provider";
import { Category } from "../../../../lib/repo/category.repo";
import { ProductLabelService, PRODUCT_LABEL_COLORS } from "../../../../lib/repo/product-label.repo";
import { ProductTopping } from "../../../../lib/repo/product-topping.repo";
import { Product, ProductLabel, ProductService } from "../../../../lib/repo/product.repo";
import { DialogPropsType } from "../../../shared/utilities/dialog/dialog";
import { Button } from "../../../shared/utilities/form/button";
import { Field } from "../../../shared/utilities/form/field";
import { Form, FormConsumer } from "../../../shared/utilities/form/form";
import { Input } from "../../../shared/utilities/form/input";
import { Label } from "../../../shared/utilities/form/label";
import { Select } from "../../../shared/utilities/form/select";
import { Switch } from "../../../shared/utilities/form/switch";
import { Img } from "../../../shared/utilities/img";
import { Popover } from "../../../shared/utilities/popover/popover";
import { AvatarUploader } from "../../../shared/utilities/uploader/avatar-uploader";
import { ProductToppingFields } from "../../product-toppings/components/product-topping-table-form";
import { useProductsContext } from "../providers/products-provider";
import { ToppingSelection } from "./topping-selection";

interface PropsType extends DialogPropsType {
  product: Product;
  category: Category;
}
export function ProductForm({ product, category, ...props }: PropsType) {
  const toast = useToast();
  const { onProductChange } = useProductsContext();
  const ref = useRef();
  const [toppings, setToppings] = useState<ProductTopping[]>(null);
  const [image, setImage] = useState("");
  const avatarUploaderRef = useRef<any>();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [labels, setLabels] = useState<ProductLabel[]>(null);
  const [openLabel, setOpenLabel] = useState<ProductLabel>(undefined);

  useEffect(() => {
    setToppings(cloneDeep(product?.toppings || []));
    setLabels(cloneDeep(product?.labels || []));
    setImage(product?.image || "");
  }, [product]);

  const onToppingSelect = (topping: ProductTopping) => {
    setToppings([...toppings, topping]);
  };

  const onImageChange = (image: string) => {
    setImage(image);
  };

  return (
    <>
      <Form
        grid
        dialog
        extraDialogClass="bg-transparent"
        extraHeaderClass="bg-gray-100 text-xl py-3 justify-center rounded-t-xl border-gray-300 pl-16"
        extraBodyClass="px-6 bg-gray-100 rounded-b-xl"
        title={`${product ? "Chỉnh sửa" : "Thêm"} món`}
        width="650px"
        initialData={product ? product : {}}
        isOpen={props.isOpen}
        onClose={props.onClose}
        onSubmit={async (data) => {
          const { name, basePrice } = data;
          try {
            let res = await ProductService.createOrUpdate({
              id: product?.id,
              data: {
                ...(product?.id
                  ? {
                      ...data,
                      image,
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
                      labelIds: labels.map((x) => x.id),
                    }
                  : { name, basePrice }),
                categoryId: category.id,
              },
              toast,
            });
            onProductChange(res, category);
            props.onClose();
          } catch (err) {}
        }}
      >
        {/* <div
        className="col-span-12 grid grid-cols-12 gap-x-5 v-scrollbar border-b border-gray-300 -mx-6 -mt-4 mb-2 p-4 bg-true"
        style={{ maxHeight: "calc(90vh - 250px)" }}
      > */}
        <div className="text-gray-400 font-semibold text-lg col-span-12 mb-4">Thông tin món</div>
        {product && (
          <div className="col-span-12 mb-3">
            <Label text="Hình sản phẩm" />
            <div className="flex">
              <div className="border border-gray-300 rounded-lg w-24 h-24 flex-center bg-white overflow-hidden">
                {image ? (
                  <Img className="w-full" compress={300} src={image} showImageOnClick />
                ) : (
                  <i className="text-4xl text-gray-500">
                    <RiImageAddFill />
                  </i>
                )}
              </div>
              <div className="ml-4 p-4 flex-1 flex-center flex-col rounded border border-gray-300 border-dashed bg-white">
                <span className="text-sm">
                  Ảnh PNG, JPEG, JPG không vượt quá 10Mb. Tỉ lệ khuyến nghị 1:1.
                </span>
                <Button
                  className="px-3 h-9 text-sm hover:underline"
                  textPrimary
                  text="Tải ảnh lên"
                  isLoading={uploadingAvatar}
                  onClick={() => {
                    avatarUploaderRef.current().onClick();
                  }}
                />
                <AvatarUploader
                  onRef={(ref) => {
                    avatarUploaderRef.current = ref;
                  }}
                  onUploadingChange={setUploadingAvatar}
                  onImageUploaded={onImageChange}
                />
              </div>
            </div>
          </div>
        )}
        <Field name="name" label="Tên sản phẩm" cols={12} required>
          <Input className="h-12 mt-2" />
        </Field>
        <Field name="basePrice" label="Giá bán" cols={product ? 4 : 12} required>
          <Input className="h-12 mt-2" number currency />
        </Field>
        {product && (
          <>
            <Field name="downPrice" label="Giá bị giảm" cols={4}>
              <Input className="h-12 mt-2" number currency />
            </Field>
            <Field
              name="saleRate"
              label="Phần trăm giảm"
              cols={4}
              constraints={{ min: 0, max: 100 }}
            >
              <Input className="h-12 mt-2" number currency="%" />
            </Field>
            <Field name="subtitle" label="Mô tả ngắn" cols={12}>
              <Input className="h-12 mt-2" />
            </Field>
            <Field label="Danh mục" cols={12}>
              <Input className="h-12 mt-2" readonly value={category?.name} />
            </Field>
            <FormConsumer>
              {({ data }) => (
                <Field name="rating" label="Đánh giá" constraints={{ min: 0, max: 5 }} cols={8}>
                  <Input
                    className="h-12 mt-2"
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
              <Input className="h-12 mt-2" number />
            </Field>
            <Field name="upsaleProductIds" label="Món mua kèm" cols={12}>
              <Select
                autocompletePromise={({ id, search }) =>
                  ProductService.getAllAutocompletePromise(
                    { id, search },
                    {
                      fragment: "id name image basePrice",
                      parseOption: (data) => ({
                        value: data.id,
                        label: data.name,
                        image: data.image,
                        basePrice: data.basePrice,
                      }),
                      query: {
                        filter: { _id: { $ne: product.id } },
                      },
                    }
                  )
                }
                placeholder="Nhập hoặc tìm kiếm món mua kèm"
                multi
                hasImage
              />
            </Field>
            <div className="col-span-12 mb-6">
              <Label text="Nhãn sản phẩm (Tối đa 3 nhãn)" />
              <div className="flex flex-wrap gap-3 mt-2">
                {labels?.map((label, index) => (
                  <div
                    className="inline-flex items-center text-gray-100 hover:text-white rounded-full font-semibold px-4 py-2 whitespace-nowrap cursor-pointer animate-emerge"
                    style={{ backgroundColor: label.color }}
                    onClick={() => setOpenLabel(label)}
                  >
                    <span className="mr-1">{label.name}</span>
                    <i
                      className="text-gray-100 hover:bg-white hover:text-danger rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        labels.splice(index, 1);
                        setLabels([...labels]);
                      }}
                    >
                      <RiCloseLine />
                    </i>
                  </div>
                ))}
                {labels?.length < 3 && (
                  <Button
                    className="rounded-full inline-flex bg-white animate-emerge"
                    icon={<RiAddCircleLine />}
                    outline
                    text="Thêm nhãn"
                    onClick={() => setOpenLabel(null)}
                  />
                )}
              </div>
            </div>

            <div className="text-gray-400 font-semibold text-lg col-span-12 mb-4">
              Thông tin tuỳ chọn
            </div>
            <div className="col-span-12">
              <Label
                text="Danh sách topping"
                description="Chọn topping từ mẫu và chỉnh sửa lại cho phù hợp"
              />
              {toppings?.map((topping, index) => (
                <div
                  className="mt-3 grid grid-cols-12 gap-x-5 bg-white p-4 shadow-md rounded"
                  key={index}
                >
                  <div className="flex mb-1 col-span-12 font-semibold uppercase text-primary">
                    <span>Topping {index + 1}</span>
                    <Button
                      className="h-auto px-2 ml-auto"
                      icon={<RiArrowUpLine />}
                      tooltip="Di chuyển lên"
                      disabled={index == 0}
                      onClick={() => {
                        const temp = toppings[index - 1];
                        toppings[index - 1] = toppings[index];
                        toppings[index] = temp;
                        setToppings([...toppings]);
                      }}
                    />
                    <Button
                      className="h-auto px-2"
                      icon={<RiArrowDownLine />}
                      tooltip="Di chuyển xuống"
                      disabled={index == toppings.length - 1}
                      onClick={() => {
                        const temp = toppings[index + 1];
                        toppings[index + 1] = toppings[index];
                        toppings[index] = temp;
                        setToppings([...toppings]);
                      }}
                    />
                    <Button
                      className="h-auto px-2 pr-0"
                      icon={<RiDeleteBin6Line />}
                      text="Xoá nhóm"
                      hoverDanger
                      onClick={() => {
                        toppings.splice(index, 1);
                        setToppings([...toppings]);
                      }}
                    />
                  </div>
                  <ProductToppingFields
                    productTopping={topping}
                    onChange={(topping) => {
                      toppings[index] = topping;
                      setToppings([...toppings]);
                    }}
                  />
                </div>
              ))}
              <Button
                className="my-3 px-0"
                textPrimary
                icon={<RiAddFill />}
                text="Chọn mẫu topping"
                innerRef={ref}
              />
              <Popover reference={ref} trigger="click" arrow={true} placement="auto-start">
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
        {/* </div> */}
        <Form.Footer>
          <Form.ButtonGroup
            className="justify-center"
            cancelText=""
            submitText={`${product ? "Chỉnh sửa" : "Thêm"} món`}
            submitProps={{ className: "bg-gradient h-14 w-64" }}
          />
        </Form.Footer>
      </Form>
      <Form
        dialog
        initialData={openLabel}
        isOpen={openLabel !== undefined}
        onClose={() => setOpenLabel(undefined)}
        title={`${openLabel ? "Chỉnh sửa" : "Thêm"} nhãn`}
        onSubmit={async (data, fullData) => {
          const { name, color } = data;
          if (openLabel) {
            if (!name || !color) {
              toast.info("Cần nhập tên và màu nhãn");
              return;
            }
            let label = await ProductLabelService.update({
              id: openLabel.id,
              data: { name, color },
              toast,
            });
            const index = labels.findIndex((x) => x.id == label.id);
            labels[index] = label;
            setLabels([...labels]);
          } else {
            if (data.create) {
              if (!name || !color) {
                toast.info("Cần nhập tên và màu nhãn");
                return;
              }
              let label = await ProductLabelService.create({
                data: { name, color },
                toast,
              });
              setLabels([...labels, label]);
            } else {
              if (!fullData.label) {
                toast.info("Cần nhập tên và màu nhãn");
                return;
              }
              setLabels([...labels, fullData.label.data]);
            }
          }
          setOpenLabel(undefined);
        }}
      >
        <FormConsumer>
          {({ data, submit }) => (
            <>
              {!openLabel && (
                <>
                  <Field
                    name="label"
                    label="Chọn nhãn"
                    className={`${data.create ? "opacity-70 pointer-events-none" : ""}`}
                  >
                    <Select
                      readonly={data.create}
                      optionsPromise={() =>
                        ProductLabelService.getAllOptionsPromise({
                          query: { limit: 0, filter: { _id: { $nin: labels.map((x) => x.id) } } },
                          parseOption: (data) => ({
                            value: data.id,
                            label: data.name,
                            color: data.color,
                            data,
                          }),
                        })
                      }
                      hasColor
                    />
                  </Field>
                  <hr />
                  <Field className="my-2" noError name="create">
                    <Switch placeholder="Tạo nhãn mới" />
                  </Field>
                </>
              )}
              <div
                className={`${data.create || openLabel ? "" : "opacity-70 pointer-events-none"}`}
              >
                <Field name="name" label="Tên nhãn">
                  <Input readonly={!data.create && !openLabel} />
                </Field>
                <Field name="color" label="Màu nhãn">
                  <Select
                    options={PRODUCT_LABEL_COLORS}
                    hasColor
                    readonly={!data.create && !openLabel}
                  />
                </Field>
              </div>
              <Form.Footer>
                <Form.ButtonGroup
                  submitText={`${openLabel ? "Chỉnh sửa" : data.create ? "Thêm" : "Chọn"} nhãn`}
                  submitProps={{
                    submit: false,
                    onClick: () => submit(),
                  }}
                />
              </Form.Footer>
            </>
          )}
        </FormConsumer>
      </Form>
    </>
  );
}
