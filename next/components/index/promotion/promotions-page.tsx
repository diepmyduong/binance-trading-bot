import React, { useState } from "react";
import { Input } from "../../shared/utilities/form/input";
import { Button } from "../../shared/utilities/form/button";
import { Promotion } from "./components/promotion";
import { SwitchTabs } from "../../shared/utilities/tab/switch-tabs";
import useScreen from "../../../lib/hooks/useScreen";
import { PromotionDetailDialog } from "./components/promotion-detail.tsx/promotion-detail-dialog";
import { PromotionConsumer, PromotionProvider } from "./provider/promotion-provider";
import { Spinner } from "../../shared/utilities/spinner";
import { ShopVoucher } from "../../../lib/repo/shop-voucher.repo";
import { useShopContext } from "../../../lib/providers/shop-provider";
import BreadCrumbs from "../../shared/utilities/breadcrumbs/breadcrumbs";
import { CustomerVoucher } from "../../../lib/repo/customer-voucher.repo";
interface Propstype extends ReactProps {}
const PromotionsPage = (props: Propstype) => {
  const promotions = [
    {
      name: "Giảm 40k cho đơn từ 150k",
      img:
        "https://file.hstatic.net/200000043306/file/banner_web_mobile_83c075fe49b44d8a8267ccd829a8748d.png",
      dated: "6/8/2021",
    },
    {
      name: "Giảm 40k cho đơn từ 150k",
      img:
        "https://file.hstatic.net/200000043306/file/banner_web_mobile_83c075fe49b44d8a8267ccd829a8748d.png",
      dated: "6/8/2021",
    },
    {
      name: "Giảm 40k cho đơn từ 150k",
      img:
        "https://file.hstatic.net/200000043306/file/banner_web_mobile_83c075fe49b44d8a8267ccd829a8748d.png",
      dated: "6/8/2021",
    },
    {
      name: "Giảm 40k cho đơn từ 150k",
      img:
        "https://file.hstatic.net/200000043306/file/banner_web_mobile_83c075fe49b44d8a8267ccd829a8748d.png",
      dated: "6/8/2021",
    },
    {
      name: "Giảm 40k cho đơn từ 150k",
      img:
        "https://file.hstatic.net/200000043306/file/banner_web_mobile_83c075fe49b44d8a8267ccd829a8748d.png",
      dated: "6/8/2021",
    },
  ];
  const [value, setValue] = useState(0);
  const screenSm = useScreen("sm");
  const { shopCode } = useShopContext();
  const [voucherSelected, setVoucherSelected] = useState<ShopVoucher>(null);
  return (
    <PromotionProvider>
      <PromotionConsumer>
        {({ shopVouchers, customerVoucher }) => (
          <div className="bg-white min-h-screen">
            <BreadCrumbs
              breadcrumbs={[
                { label: "Trang chủ", href: `/?code=${shopCode}` },
                { label: "Khuyến mãi" },
              ]}
              className="pt-4 px-4"
            />
            <SwitchTabs
              className="p-4"
              onChange={(val) => setValue(val)}
              value={value}
              options={
                (screenSm && [
                  { label: "Khuyến mãi của quán", value: 0 },
                  { label: "Khuyến mãi của tôi", value: 1 },
                ]) || [
                  { label: "KM của quán", value: 0 },
                  { label: "KM của tôi", value: 1 },
                ]
              }
            />
            <div className="mt-5 flex flex-col text-sm sm:text-base overscroll-y-auto px-4 bg-white h-full min-h-xs">
              {/* <div className="flex my-4 border-group rounded-md h-12">
          <Input placeholder="Nhập mã giảm giá ở đây" />{" "}
          <Button className="h-12 whitespace-nowrap" primary text="Áp dụng" />
        </div> */}
              {(value === 0 && (
                <>
                  {shopVouchers ? (
                    <div className="mb-4">
                      {shopVouchers.length === 0 ? (
                        <span className="h-screen font-semibold text-center">
                          Cửa hàng hiện chưa có mã khuyến mãi nào
                        </span>
                      ) : (
                        <>
                          {shopVouchers.map((item: ShopVoucher, index) => (
                            <Promotion
                              key={index}
                              promotion={item}
                              onClick={() => setVoucherSelected(item)}
                            />
                          ))}
                        </>
                      )}
                    </div>
                  ) : (
                    <Spinner />
                  )}
                </>
              )) || (
                <>
                  {customerVoucher ? (
                    <div className="mb-4">
                      {customerVoucher.length === 0 ? (
                        <span className="min-h-screen font-semibold text-center">
                          Bạn chưa có mã khuyến mãi nào
                        </span>
                      ) : (
                        <>
                          {customerVoucher.map((item: CustomerVoucher, index) => (
                            <Promotion
                              key={index}
                              promotion={item.voucher}
                              onClick={() => setVoucherSelected(item.voucher)}
                            />
                          ))}
                        </>
                      )}
                    </div>
                  ) : (
                    <Spinner />
                  )}
                </>
              )}
            </div>
            <PromotionDetailDialog
              promotion={voucherSelected}
              isOpen={voucherSelected ? true : false}
              onClose={() => setVoucherSelected(null)}
            />
          </div>
        )}
      </PromotionConsumer>
    </PromotionProvider>
  );
};

export default PromotionsPage;
