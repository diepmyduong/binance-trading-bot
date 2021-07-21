import cloneDeep from "lodash/cloneDeep";
import { useEffect, useRef, useState } from "react";
import {
  RiAddFill,
  RiArrowDownSLine,
  RiArrowRightLine,
  RiCloseFill,
  RiImageAddFill,
} from "react-icons/ri";
import { NumberPipe } from "../../../../lib/pipes/number";
import { useToast } from "../../../../lib/providers/toast-provider";
import { PAYMENT_METHODS } from "../../../../lib/repo/order.repo";
import { ProductService } from "../../../../lib/repo/product.repo";
import {
  DiscountItem,
  DISCOUNT_BILL_UNITS,
  OfferItem,
  ShopVoucher,
  SHOP_VOUCHER_TYPES,
} from "../../../../lib/repo/shop-voucher.repo";
import { ProductSelectionPopover } from "../../../shared/shop-layout/product-selection-popover";
import { Accordion } from "../../../shared/utilities/accordion/accordion";
import { Button } from "../../../shared/utilities/form/button";
import { Checkbox } from "../../../shared/utilities/form/checkbox";
import { DatePicker } from "../../../shared/utilities/form/date";
import { Editor } from "../../../shared/utilities/form/editor";
import { Field } from "../../../shared/utilities/form/field";
import { Form, FormConsumer, FormPropsType } from "../../../shared/utilities/form/form";
import { Input } from "../../../shared/utilities/form/input";
import { Label } from "../../../shared/utilities/form/label";
import { Select } from "../../../shared/utilities/form/select";
import { Switch } from "../../../shared/utilities/form/switch";
import { Img } from "../../../shared/utilities/img";
import { DataTable } from "../../../shared/utilities/table/data-table";
import { AvatarUploader } from "../../../shared/utilities/uploader/avatar-uploader";

interface PropsType extends FormPropsType {
  voucher: ShopVoucher;
}
export function VoucherForm({ voucher, ...props }: PropsType) {
  const [discountItems, setDiscountItems] = useState<DiscountItem[]>();
  const [offerItems, setOfferItems] = useState<OfferItem[]>();
  const discountItemsRef = useRef();
  const offerItemsRef = useRef();
  const [openDiscountItem, setOpenDiscountItem] = useState<DiscountItem>(null);
  const [openOfferItem, setOpenOfferItem] = useState<OfferItem>(null);
  const toast = useToast();
  const avatarUploaderRef = useRef<any>();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [image, setImage] = useState("");
  const [openAppliedCondition, setOpenAppliedCondition] = useState(false);

  useEffect(() => {
    if (voucher?.id) {
      setDiscountItems(cloneDeep(voucher.discountItems));
      setOfferItems(cloneDeep(voucher.offerItems));
      setImage(voucher.image);
    } else {
      setDiscountItems(null);
      setOfferItems(null);
      setImage("");
    }
  }, [voucher]);

  const productAutocomplete = ({ id, search }) =>
    ProductService.getAllAutocompletePromise(
      { id, search },
      {
        fragment: "id name image basePrice",
        parseOption: (data) => ({
          value: data.id,
          label: data.name,
          image: data.image,
        }),
      }
    );

  const onImageChange = (image: string) => {
    setImage(image);
  };
  return (
    <>
      <DataTable.Form
        extraDialogClass="bg-transparent"
        extraHeaderClass="bg-gray-100 text-xl py-3 justify-center rounded-t-xl border-gray-300 pl-16"
        extraBodyClass="px-6 bg-gray-100 rounded-b-xl"
        saveButtonGroupProps={{
          className: "justify-center",
          submitProps: { className: "bg-gradient h-14 w-64" },
          cancelText: "",
        }}
        width={voucher?.id ? "1080px" : "550px"}
        grid
        beforeSubmit={(data) => ({
          ...data,
          discountItems:
            discountItems?.map((x) => ({
              productId: x.productId,
              discountUnit: x.discountUnit,
              discountValue: x.discountValue,
              maxDiscount: x.maxDiscount,
            })) || undefined,
          offerItems:
            offerItems?.map((x) => ({
              productId: x.productId,
              qty: x.qty,
              note: x.note,
            })) || undefined,
          image: image || undefined,
        })}
      >
        <FormConsumer>
          {({ data }) => (
            <>
              <div
                className={`${
                  voucher?.id ? "col-span-6" : "col-span-12"
                } grid grid-cols-12 gap-x-5 auto-rows-min`}
              >
                <div className="text-gray-400 font-semibold text-lg col-span-12 mb-4">
                  Thông tin chung
                </div>
                <Field name="code" label="Mã khuyến mãi" cols={6} required readonly={!!voucher?.id}>
                  <Input />
                </Field>
                <Field
                  name="type"
                  label="Loại khuyến mãi"
                  cols={6}
                  required
                  readonly={!!voucher?.id}
                >
                  <Select options={SHOP_VOUCHER_TYPES} />
                </Field>
                <Field name="description" label="Mô tả" cols={12} required>
                  <Input />
                </Field>
                {voucher?.id && (
                  <>
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
                            Ảnh PNG, JPEG, JPG không quá 10Mb. Tỉ lệ 1:1.
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
                    <Field name="content" label="Nội dung voucher" cols={12}>
                      <Editor maxHeight="300px" />
                    </Field>
                    <div
                      className="text-gray-400 font-semibold text-lg col-span-12 mb-4 justify-between flex cursor-pointer hover:text-primary"
                      onClick={() => {
                        setOpenAppliedCondition(!openAppliedCondition);
                      }}
                    >
                      <span>Điều kiện áp dụng</span>
                      <i className={`transform ${openAppliedCondition ? "rotate-180" : ""}`}>
                        <RiArrowDownSLine />
                      </i>
                    </div>
                    <Accordion
                      isOpen={openAppliedCondition}
                      className="col-span-12 grid grid-cols-12 gap-x-5"
                    >
                      <Field name="startDate" label="Ngày bắt đầu" cols={6}>
                        <DatePicker />
                      </Field>
                      <Field name="endDate" label="Ngày kết thúc" cols={6}>
                        <DatePicker />
                      </Field>
                      <Field name="issueNumber" label="Số lượng phát hành" cols={6}>
                        <Input number />
                      </Field>
                      <Field name="issueByDate" label=" " cols={6}>
                        <Checkbox placeholder="Phát hành mỗi ngày" />
                      </Field>
                      <Field name="useLimit" label="Số lượng dùng mỗi khách" cols={6}>
                        <Input number />
                      </Field>
                      <Field name="useLimitByDate" label=" " cols={6}>
                        <Checkbox placeholder="Số lượng dùng theo ngày" />
                      </Field>
                      <Field name="isPrivate" label="" cols={6}>
                        <Checkbox placeholder="Mã riêng tư" />
                      </Field>
                      <Field name="isActive" label="" cols={6}>
                        <Switch placeholder="Kích hoạt" />
                      </Field>
                    </Accordion>
                  </>
                )}
              </div>
              {voucher?.id && (
                <div className={`col-span-6 grid grid-cols-12 gap-x-5 auto-rows-min`}>
                  <div className="text-gray-400 font-semibold text-lg col-span-12 mb-4">
                    Chi tiết khuyến mãi
                  </div>
                  <Field name="applyItemIds" label="Các sản phẩm áp dụng" cols={12}>
                    <Select autocompletePromise={productAutocomplete} multi hasImage />
                  </Field>
                  <Field name="exceptItemIds" label="Các sản phẩm không áp dụng" cols={12}>
                    <Select autocompletePromise={productAutocomplete} multi hasImage />
                  </Field>
                  <Field
                    name="applyPaymentMethods"
                    label="Phương thức thanh toán áp dụng"
                    cols={12}
                  >
                    <Select options={PAYMENT_METHODS} multi />
                  </Field>
                  <Field name="minItemQty" label="Tổng số món tối thiểu" cols={6}>
                    <Input number suffix="món" />
                  </Field>
                  <Field name="minSubtotal" label="Tổng tiền hàng tối thiểu" cols={6}>
                    <Input number suffix="VND" />
                  </Field>
                  <hr className="col-span-12 border-gray-300 mb-4" />
                  {voucher.type == "DISCOUNT_ITEM" && (
                    <div className="col-span-12">
                      <Label text="Các sản phẩm được giảm giá" />
                      <div className="grid grid-cols-2 gap-y-3"></div>
                      {discountItems?.map((item, index) => (
                        <ProductItem
                          key={item.productId}
                          item={item}
                          hasSalePrice
                          onClick={() => setOpenDiscountItem(item)}
                          onRemove={() => {
                            discountItems.splice(index, 1);
                            setDiscountItems([...discountItems]);
                          }}
                        />
                      ))}
                      <Button
                        className="mb-4 px-0"
                        textPrimary
                        icon={<RiAddFill />}
                        text="Chọn sản phẩm"
                        innerRef={discountItemsRef}
                      />
                      <ProductSelectionPopover
                        reference={discountItemsRef}
                        onProductSelect={(item) => {
                          if (discountItems.find((x) => x.productId == item.id)) {
                            toast.info("Sản phẩm này đã được chọn");
                            return;
                          }
                          const discountItem: DiscountItem = {
                            productId: item.id,
                            product: item,
                            discountUnit: "VND",
                            discountValue: 0,
                            maxDiscount: 0,
                          };
                          setDiscountItems([...discountItems, discountItem]);
                          setOpenDiscountItem(discountItem);
                        }}
                      />
                    </div>
                  )}
                  {voucher.type == "OFFER_ITEM" && (
                    <div className="col-span-12">
                      <Label text="Các sản phẩm được tặng" />
                      <div className="grid grid-cols-2 gap-y-3"></div>
                      {offerItems?.map((item, index) => (
                        <ProductItem
                          item={item}
                          onClick={() => setOpenOfferItem(item)}
                          onRemove={() => {
                            offerItems.splice(index, 1);
                            setOfferItems([...offerItems]);
                          }}
                        />
                      ))}
                      <Button
                        className="mb-4 px-0"
                        textPrimary
                        icon={<RiAddFill />}
                        text="Chọn sản phẩm"
                        innerRef={offerItemsRef}
                      />
                      <ProductSelectionPopover
                        reference={offerItemsRef}
                        onProductSelect={(item) => {
                          if (offerItems.find((x) => x.productId == item.id)) {
                            toast.info("Sản phẩm này đã được chọn");
                            return;
                          }
                          const offerItem: OfferItem = {
                            productId: item.id,
                            product: item,
                            qty: 1,
                            note: "",
                          };
                          setOfferItems([...offerItems, offerItem]);
                          setOpenOfferItem(offerItem);
                        }}
                      />
                    </div>
                  )}
                  {voucher.type == "SAME_PRICE" && (
                    <div className="col-span-12">
                      <Field name="samePrice" label="Đồng giá">
                        <Input number suffix="VND" className="w-64" />
                      </Field>
                      <Label text="Các sản phẩm đồng giá" />
                      <div className="grid grid-cols-2 gap-y-3"></div>
                      {offerItems?.map((item, index) => (
                        <ProductItem
                          key={item.productId}
                          item={item}
                          samePrice={data.samePrice || 0}
                          onClick={() => setOpenOfferItem(item)}
                          onRemove={() => {
                            offerItems.splice(index, 1);
                            setOfferItems([...offerItems]);
                          }}
                        />
                      ))}
                      <Button
                        className="mb-4 px-0"
                        textPrimary
                        icon={<RiAddFill />}
                        text="Chọn sản phẩm"
                        innerRef={offerItemsRef}
                      />
                      <ProductSelectionPopover
                        reference={offerItemsRef}
                        onProductSelect={(item) => {
                          if (offerItems.find((x) => x.productId == item.id)) {
                            toast.info("Sản phẩm này đã được chọn");
                            return;
                          }
                          const offerItem: OfferItem = {
                            productId: item.id,
                            product: item,
                            qty: 1,
                            note: "",
                          };
                          setOfferItems([...offerItems, offerItem]);
                          setOpenOfferItem(offerItem);
                        }}
                      />
                    </div>
                  )}
                  {(voucher.type == "DISCOUNT_BILL" || voucher.type == "SHIP_FEE") && (
                    <>
                      <Field name="discountUnit" label="Loại giảm giá" cols={6}>
                        <Select options={DISCOUNT_BILL_UNITS} defaultValue="VND" />
                      </Field>
                      <Field name="discountValue" label="Giá trị giảm" cols={6}>
                        <Input number suffix={data.discountUnit == "VND" ? "VND" : "%"} />
                      </Field>
                      <Field name="maxDiscount" label="Giảm tối đa" cols={6}>
                        <Input number suffix="VND" />
                      </Field>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </FormConsumer>
      </DataTable.Form>
      <Form
        width="480px"
        grid
        dialog
        title="Chỉnh thông tin giảm giá sản phẩm"
        isOpen={!!openDiscountItem}
        onClose={() => setOpenDiscountItem(null)}
        initialData={openDiscountItem}
        onSubmit={(data) => {
          let discountItem = discountItems.find((x) => x.productId == openDiscountItem.productId);
          discountItem.discountUnit = data.discountUnit;
          discountItem.discountValue = data.discountValue;
          discountItem.maxDiscount = data.maxDiscount;
          setDiscountItems([...discountItems]);
          setOpenDiscountItem(null);
        }}
      >
        {openDiscountItem && (
          <Form.Consumer>
            {({ data }) => (
              <>
                <Field label="Sản phẩm" cols={12}>
                  <Input value={openDiscountItem.product.name} readonly />
                </Field>
                <Field label="Giá gốc" cols={6}>
                  <Input number value={openDiscountItem.product.basePrice} readonly />
                </Field>
                <Field label="Giá sau khi giảm" cols={6}>
                  <Input
                    number
                    value={calculateSalePrice(
                      openDiscountItem.product.basePrice,
                      data.discountUnit,
                      data.discountValue,
                      data.maxDiscount
                    )}
                    readonly
                  />
                </Field>
                <Field name="discountUnit" label="Loại giảm giá" cols={6}>
                  <Select options={DISCOUNT_BILL_UNITS} defaultValue="VND" />
                </Field>
                <Field name="discountValue" label="Giá trị giảm" cols={6}>
                  <Input number suffix={data.discountUnit == "VND" ? "VND" : "%"} />
                </Field>
                <Field name="maxDiscount" label="Giảm tối đa" cols={6}>
                  <Input number suffix="VND" />
                </Field>
              </>
            )}
          </Form.Consumer>
        )}
        <Form.Footer>
          <Form.ButtonGroup />
        </Form.Footer>
      </Form>
      <Form
        width="480px"
        grid
        dialog
        title="Chỉnh thông tin sản phẩm"
        isOpen={!!openOfferItem}
        onClose={() => setOpenOfferItem(null)}
        initialData={openOfferItem}
        onSubmit={(data) => {
          let offerItem = offerItems.find((x) => x.productId == openOfferItem.productId);
          offerItem.qty = data.qty;
          offerItem.note = data.note;
          setOfferItems([...offerItems]);
          setOpenOfferItem(null);
        }}
      >
        {openOfferItem && (
          <Form.Consumer>
            {({ data }) => (
              <>
                <Field label="Sản phẩm" cols={12}>
                  <Input value={openOfferItem.product.name} readonly />
                </Field>
                <Field name="qty" label="Số lượng" cols={4}>
                  <Input number />
                </Field>
                <Field name="note" label="Ghi chú" cols={8}>
                  <Input />
                </Field>
              </>
            )}
          </Form.Consumer>
        )}
        <Form.Footer>
          <Form.ButtonGroup />
        </Form.Footer>
      </Form>
    </>
  );
}

function ProductItem({
  item,
  hasSalePrice = false,
  samePrice,
  onRemove,
  onClick,
}: {
  hasSalePrice?: boolean;
  item: DiscountItem | OfferItem;
  samePrice?: number;
  onRemove: () => any;
  onClick: () => any;
}) {
  return (
    <div
      className={`flex bg-white border border-gray-300 hover:border-primary transition-colors duration-150 shadow-sm rounded mb-2 p-3 cursor-pointer`}
      key={item.productId}
      onClick={onClick}
    >
      <Img className="w-14 rounded" src={item.product.image} compress={50} />
      <div className="font-semibold pl-3 flex-1">
        <div className="text-gray-800">{item.product.name}</div>
        {(item as OfferItem).note && (
          <div className="text-gray-600 font-normal text-sm">{(item as OfferItem).note}</div>
        )}
        <div className="flex items-center">
          <span className="line-through text-gray-600">
            {NumberPipe(item.product.basePrice, true)}
          </span>
          <i className="mx-3">
            <RiArrowRightLine />
          </i>
          {hasSalePrice ? (
            <span className="text-danger">
              {NumberPipe(
                calculateSalePrice(
                  item.product.basePrice,
                  (item as DiscountItem).discountUnit,
                  (item as DiscountItem).discountValue,
                  (item as DiscountItem).maxDiscount
                ),
                true
              )}
            </span>
          ) : (
            <>
              {samePrice !== undefined ? (
                <span className="text-danger">{NumberPipe(samePrice, true)}</span>
              ) : (
                <span className="text-success">Tặng {(item as OfferItem).qty}</span>
              )}
            </>
          )}
        </div>
      </div>
      <Button
        className="transform translate-x-4"
        iconClassName="text-3xl"
        icon={<RiCloseFill />}
        hoverDanger
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      />
    </div>
  );
}

const calculateSalePrice = (
  basePrice,
  discountUnit: "VND" | "PERCENT",
  discountValue,
  maxDiscount
) => {
  if (!discountUnit || !discountValue) return null;

  let discount = 0;
  if (discountUnit == "VND") {
    discount = discountValue;
  } else {
    discount = (basePrice * discountValue) / 100;
  }
  if (maxDiscount) discount = discount > maxDiscount ? maxDiscount : discount;
  return basePrice - discount;
};
