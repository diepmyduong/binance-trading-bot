import { useEffect, useRef, useState } from "react";
import {
  RiAddCircleLine,
  RiCloseCircleFill,
  RiCloseLine,
  RiCoupon2Line,
  RiCupFill,
  RiLinksLine,
  RiStarFill,
} from "react-icons/ri";
import { useShopLayoutContext } from "../../../../layouts/shop-layout/providers/shop-layout-provider";
import {
  ShopBanner,
  ShopProductGroup,
  ShopTag,
  SHOP_BANNER_ACTIONS,
} from "../../../../lib/repo/shop-config.repo";
import { Button } from "../../../shared/utilities/form/button";
import { Field } from "../../../shared/utilities/form/field";
import { Form, FormConsumer } from "../../../shared/utilities/form/form";
import { Input } from "../../../shared/utilities/form/input";
import { Label } from "../../../shared/utilities/form/label";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import { Popover } from "../../../shared/utilities/popover/popover";
import cloneDeep from "lodash/cloneDeep";
import { Img } from "../../../shared/utilities/img";
import { Switch } from "../../../shared/utilities/form/switch";
import { ImageInput } from "../../../shared/utilities/form/image-input";
import { Select } from "../../../shared/utilities/form/select";
import { ProductService } from "../../../../lib/repo/product.repo";
import { Accordion } from "../../../shared/utilities/accordion/accordion";
import { NumberPipe } from "../../../../lib/pipes/number";
import { PRODUCT_LABEL_COLORS } from "../../../../lib/repo/product-label.repo";
import { ShopVoucherService } from "../../../../lib/repo/shop-voucher.repo";

export function ConfigSettings() {
  const { shopConfig, updateShopConfig } = useShopLayoutContext();
  const [submitting, setSubmitting] = useState(false);
  const [shopTags, setShopTags] = useState<ShopTag[]>();
  const [openShopTag, setOpenShopTag] = useState<ShopTag>(undefined);
  const [openShopTagIndex, setOpenShopTagIndex] = useState(-1);
  const [shopBanners, setShopBanners] = useState<ShopBanner[]>(undefined);
  const [openShopBanner, setOpenShopBanner] = useState<ShopBanner>(undefined);
  const [openShopBannerIndex, setOpenShopBannerIndex] = useState(-1);
  const [shopProductGroups, setShopProductGroups] = useState<ShopProductGroup[]>();
  const [openProductGroup, setOpenProductGroup] = useState<ShopProductGroup>(undefined);
  const [openProductGroupIndex, setOpenProductGroupIndex] = useState(-1);
  const ref = useRef();

  useEffect(() => {
    if (shopConfig) {
      setShopTags(cloneDeep(shopConfig.tags));
      setShopBanners(cloneDeep(shopConfig.banners));
      setShopProductGroups(cloneDeep(shopConfig.productGroups));
    }
  }, [shopConfig]);

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      await updateShopConfig({
        ...data,
        tags: shopTags.map((x) => {
          const { __typename, ...item } = x as any;
          return item;
        }),
        banners: shopBanners.map((x) => {
          const { __typename, product, voucher, voucherText, ...item } = x as any;
          return item;
        }),
        productGroups: shopProductGroups.map((x) => {
          const { __typename, products, ...item } = x as any;
          return item;
        }),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Form initialData={shopConfig} className="max-w-screen-sm animate-emerge" onSubmit={onSubmit}>
        <div className="text-gray-400 font-semibold mt-4 mb-4 pl-1 text-lg">Màu chủ đạo</div>
        <div className="flex gap-x-5 w-full">
          <Field className="flex-1" label="Màu chính" name="primaryColor">
            <Select hasColor clearable placeholder="Mặc định" options={PRODUCT_LABEL_COLORS} />
          </Field>
          <Field className="flex-1" label="Màu phụ" name="accentColor">
            <Select hasColor clearable placeholder="Mặc định" options={PRODUCT_LABEL_COLORS} />
          </Field>
        </div>
        <Label text="Tin nhắn SMS" />
        <div className="flex gap-x-5 w-full">
          <Field className="flex-1" name="smsOrder">
            <Switch placeholder="Gửi SMS đơn hàng" />
          </Field>
          <Field className="flex-1" name="smsOtp">
            <Switch placeholder="Gửi SMS OTP" />
          </Field>
        </div>
        <div className="text-gray-400 font-semibold mt-1 mb-4 pl-1 text-lg">Đánh giá của quán</div>
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
        <Field label="Số lượng người đã mua hàng" name="soldQty">
          <Input className="h-12" number suffix="người đã mua hàng" />
        </Field>
        <Field label="Số lượng người đã đánh giá" name="ratingQty">
          <Input className="h-12" number suffix="người đã đánh giá" />
        </Field>
        <Field label="Tiêu đề upsale" name="upsaleTitle">
          <Input className="h-12" />
        </Field>
        <Label text="Tag đánh giá" />
        <div className="flex gap-3 flex-wrap mt-1 mb-4">
          {shopTags?.map((tag, index) => (
            <button
              type="button"
              className="flex items-center bg-gray-200 text-gray-600 hover:text-gray-800 hover:bg-gray-300 py-1.5 px-3 rounded-full"
              key={index}
              onClick={() => {
                setOpenShopTag(tag);
                setOpenShopTagIndex(index);
              }}
            >
              <span>
                {tag.icon} {tag.name} ({tag.qty}){" "}
              </span>
              <i
                className="text-lg ml-1 cursor-pointer text-gray-400 hover:text-danger"
                onClick={(e) => {
                  e.stopPropagation();
                  shopTags.splice(index, 1);
                  setShopTags([...shopTags]);
                }}
              >
                <RiCloseCircleFill />
              </i>
            </button>
          ))}
          <button
            type="button"
            className="flex items-center bg-gray-200 text-gray-600 hover:text-gray-800 hover:bg-gray-300 py-1.5 px-3 rounded-full"
            onClick={() => setOpenShopTag(null)}
          >
            <i>
              <RiAddCircleLine />
            </i>
            <span className="ml-2 font-semibold">Thêm tag đánh giá</span>
          </button>
        </div>
        <div className="text-gray-400 font-semibold mt-4 mb-4 pl-1 text-lg">Banner</div>
        <div className="flex flex-col gap-y-2 mt-1 mb-4">
          {shopBanners?.map((banner, index) => (
            <div
              key={index}
              className="flex items-center w-full p-3 bg-white border border-gray-300 rounded cursor-pointer hover:border-primary"
              onClick={() => {
                setOpenShopBanner(banner);
                setOpenShopBannerIndex(index);
              }}
            >
              <Img className="w-40 rounded" ratio169 src={banner.image} showImageOnClick />
              <div className="px-4 flex-1">
                <div className="flex text-gray-500 font-semibold">
                  <i className="mt-1 mr-1">
                    {
                      {
                        WEBSITE: <RiLinksLine />,
                        PRODUCT: <RiCupFill />,
                        VOUCHER: <RiCoupon2Line />,
                      }[banner.actionType]
                    }
                  </i>
                  <span>
                    {SHOP_BANNER_ACTIONS.find((x) => x.value == banner.actionType)?.label}
                  </span>
                </div>
                {banner.actionType == "PRODUCT" && <div>{banner.product?.name}</div>}
                {banner.actionType == "VOUCHER" && (
                  <div>
                    {(banner as any).voucherText ||
                      (banner?.voucher?.code != undefined
                        ? `【${banner?.voucher?.code}】${banner?.voucher?.description}`
                        : "Chưa chọn mã khuyến mãi")}
                  </div>
                )}
                {banner.actionType == "WEBSITE" && (
                  <a className="block w-full text-ellipsis">{banner.link}</a>
                )}
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <Switch
                  value={banner.isPublic}
                  onChange={(isPublic) => {
                    banner.isPublic = isPublic;
                    setShopBanners([...shopBanners]);
                  }}
                />
              </div>
              <Button
                className="text-gray-400"
                icon={<RiCloseCircleFill />}
                iconClassName={"text-xl"}
                hoverDanger
                onClick={(e) => {
                  e.stopPropagation();
                  shopBanners.splice(index, 1);
                  setShopBanners([...shopBanners]);
                }}
              />
            </div>
          ))}
          <div
            className="flex-center w-full p-3 bg-white border border-gray-300 rounded text-gray-600 cursor-pointer hover:border-primary hover:text-primary"
            onClick={() => setOpenShopBanner(null)}
          >
            <i className="text-xl">
              <RiAddCircleLine />
            </i>
            <span className="ml-1 font-semibold">Thêm banner</span>
          </div>
        </div>
        <div className="text-gray-400 font-semibold mt-4 mb-4 pl-1 text-lg">
          Các nhóm sản phẩm đề xuất
        </div>
        <div className="flex flex-col gap-y-2 mt-1 mb-4">
          {shopProductGroups?.map((group, index) => (
            <div
              key={index}
              className="w-full p-3 pt-2 bg-white border border-gray-300 rounded cursor-pointer hover:border-primary"
              onClick={() => {
                setOpenProductGroup(group);
                setOpenProductGroupIndex(index);
              }}
            >
              <div className="flex items-center">
                <div className="flex-1 pr-2 font-semibold">{group.name}</div>
                <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                  <Switch
                    value={group.isPublic}
                    onChange={(isPublic) => {
                      group.isPublic = isPublic;
                      setShopProductGroups([...shopProductGroups]);
                    }}
                  />
                  <Button
                    className="text-gray-400"
                    icon={<RiCloseCircleFill />}
                    iconClassName={"text-xl"}
                    hoverDanger
                    onClick={(e) => {
                      e.stopPropagation();
                      shopProductGroups.splice(index, 1);
                      setShopProductGroups([...shopProductGroups]);
                    }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {group.products?.map((product) => (
                  <div className="col-span-1 flex flex-col" key={product.id}>
                    <Img className="w-full rounded" src={product.image} />
                    <div className="font-semibold text-gray-700 my-1">
                      {product.name || product.label}
                    </div>
                    <div className="font-semibold text-danger mt-auto">
                      {NumberPipe(product.basePrice, true)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div
            className="flex-center w-full p-3 bg-white border border-gray-300 rounded text-gray-600 cursor-pointer hover:border-primary hover:text-primary"
            onClick={() => setOpenProductGroup(null)}
          >
            <i className="text-xl">
              <RiAddCircleLine />
            </i>
            <span className="ml-1 font-semibold">Thêm nhóm sản phẩm</span>
          </div>
        </div>
        <Form.Footer className="justify-end gap-3">
          <Button
            primary
            className="bg-gradient"
            text="Lưu thay đổi"
            submit
            isLoading={submitting}
          />
        </Form.Footer>
      </Form>
      <Form
        dialog
        grid
        title={`${openShopTag ? "Chỉnh sửa" : "Thêm"} tag đánh giá`}
        initialData={openShopTag}
        isOpen={openShopTag !== undefined}
        onClose={() => setOpenShopTag(undefined)}
        onSubmit={(data) => {
          if (openShopTag) {
            shopTags[openShopTagIndex] = data;
            setShopTags([...shopTags]);
          } else {
            setShopTags([...shopTags, data]);
          }
          setOpenShopTag(undefined);
        }}
      >
        <Form.Consumer>
          {({ data, onFieldChange }) => (
            <>
              <Field name="icon" label="Emoji" cols={12}>
                <Input
                  value={data.icon}
                  suffixInputFocus={false}
                  suffix={
                    <Button
                      unfocusable
                      className="bg-gray-100 border-l border-gray-300 rounded-l-none"
                      innerRef={ref}
                      text="Chọn Emoji"
                    />
                  }
                />
              </Field>
              <Popover reference={ref} className="w-80" trigger="click" placement="top">
                <Picker
                  native
                  color="#0d57ef"
                  i18n={EMOJI_MART_I18N}
                  onSelect={(emoji) => {
                    onFieldChange("icon", emoji.native, emoji);
                    (ref.current as any)._tippy.hide();
                  }}
                />
              </Popover>
            </>
          )}
        </Form.Consumer>
        <Field name="name" label="Tên tag" cols={7} required>
          <Input />
        </Field>
        <Field name="qty" label="Số lượng" cols={5} required>
          <Input number />
        </Field>
        <Form.Footer>
          <Form.ButtonGroup />
        </Form.Footer>
      </Form>
      <Form
        dialog
        grid
        title={`${openShopBanner ? "Chỉnh sửa" : "Thêm"} banner`}
        initialData={openShopBanner}
        isOpen={openShopBanner !== undefined}
        onClose={() => setOpenShopBanner(undefined)}
        onSubmit={(data, fullData) => {
          if (openShopBanner) {
            shopBanners[openShopBannerIndex] = {
              ...shopBanners[openShopBannerIndex],
              ...data,
              product:
                data.actionType == "PRODUCT" ? { name: fullData.productId.label } : undefined,
              voucherText: data.actionType == "VOUCHER" ? fullData.voucherId.label : undefined,
            };
            setShopBanners([...shopBanners]);
          } else {
            setShopBanners([...shopBanners, { ...data, isPublic: true }]);
          }
          setOpenShopBanner(undefined);
        }}
      >
        <Field name="image" label="Hình banner" cols={12} required>
          <ImageInput largeImage ratio169 cover />
        </Field>
        <Field name="actionType" label="Loại hành động" cols={12} required>
          <Select options={SHOP_BANNER_ACTIONS} />
        </Field>
        <Form.Consumer>
          {({ data }) => (
            <>
              <Accordion className="col-span-12" isOpen={data.actionType == "WEBSITE"}>
                <Field name="link" label="Đường dẫn website" cols={12}>
                  <Input type="url" />
                </Field>
              </Accordion>
              <Accordion className="col-span-12" isOpen={data.actionType == "PRODUCT"}>
                <Field name="productId" label="Chọn món" cols={12}>
                  <Select
                    autocompletePromise={({ id, search }) =>
                      ProductService.getAllAutocompletePromise({ id, search })
                    }
                  />
                </Field>
              </Accordion>
              <Accordion className="col-span-12" isOpen={data.actionType == "VOUCHER"}>
                <Field name="voucherId" label="Chọn khuyến mãi" cols={12}>
                  <Select
                    autocompletePromise={({ id, search }) =>
                      ShopVoucherService.getAllAutocompletePromise(
                        { id, search },
                        {
                          fragment: "id code description",
                          parseOption: (data) => ({
                            value: data.id,
                            label: `【${data.code}】${data.description}`,
                          }),
                        }
                      )
                    }
                  />
                </Field>
              </Accordion>
            </>
          )}
        </Form.Consumer>
        <Form.Footer>
          <Form.ButtonGroup />
        </Form.Footer>
      </Form>
      <Form
        dialog
        grid
        title={`${openProductGroup ? "Chỉnh sửa" : "Thêm"} nhóm sản phẩm`}
        initialData={openProductGroup}
        isOpen={openProductGroup !== undefined}
        onClose={() => setOpenProductGroup(undefined)}
        onSubmit={(data, fullData) => {
          if (openProductGroup) {
            shopProductGroups[openProductGroupIndex] = {
              ...shopProductGroups[openProductGroupIndex],
              products: data.productIds.map(
                (id) =>
                  shopProductGroups[openProductGroupIndex].products.find((x) => x.id == id) ||
                  fullData.productIds.find((x) => x.value == id)
              ),
              ...data,
            };
            setShopProductGroups([...shopProductGroups]);
          } else {
            setShopProductGroups([
              ...shopProductGroups,
              { ...data, products: fullData.productIds, isPublic: true },
            ]);
          }
          setOpenProductGroup(undefined);
        }}
      >
        <Field name="name" label="Tên nhóm sản phẩm" cols={12} required>
          <Input />
        </Field>
        <Field name="productIds" label="Sản phẩm" cols={12} required>
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
                }
              )
            }
            multi
            hasImage
          />
        </Field>
        <Form.Footer>
          <Form.ButtonGroup />
        </Form.Footer>
      </Form>
    </>
  );
}

const EMOJI_MART_I18N = {
  search: "Tìm kiếm",
  clear: "Xoá", // Accessible label on "clear" button
  notfound: "Không có Emoji",
  skintext: "Chọn màu da mặc định",
  categories: {
    search: "Kết quả tìm kiếm",
    recent: "Sử dụng gần đây",
    smileys: "Mặt cười & Cảm xúc",
    people: "Con người & Cơ thể",
    nature: "Động vật & Thiên nhiên",
    foods: "Thức ăn & Đồ uống",
    activity: "Hoạt động",
    places: "Du lịch & Địa điểm",
    objects: "Đồ vật",
    symbols: "Biểu tượng",
    flags: "Cờ",
    custom: "Tuỳ chỉnh",
  },
  categorieslabel: "Danh mục Emoji", // Accessible title for the list of categories
  skintones: {
    1: "Màu da mặc định",
    2: "Màu da sáng",
    3: "Màu da sáng vừa",
    4: "Màu da vừa",
    5: "Màu da tối vừa",
    6: "Màu da tối",
  },
};
