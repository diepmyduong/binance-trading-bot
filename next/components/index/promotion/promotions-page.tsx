import React, { useState } from "react";
import { Input } from "../../shared/utilities/form/input";
import { Button } from "../../shared/utilities/form/button";
import { Promotion } from "./components/promotion";
import { SwitchTabs } from "../../shared/utilities/tab/switch-tabs";
import useScreen from "../../../lib/hooks/useScreen";
import { PromotionDetailDialog } from "./components/promotion-detail.tsx/promotion-detail-dialog";
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
  const [showDialog, setShowDialog] = useState(false);
  return (
    <div>
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
      <div className="flex flex-col text-sm sm:text-base overscroll-y-auto px-4 bg-bluegray-light h-full min-h-xs">
        <div className="flex my-4 border-group rounded-md h-12">
          <Input placeholder="Nhập mã giảm giá ở đây" />{" "}
          <Button className="h-12 whitespace-nowrap" primary text="Áp dụng" />
        </div>
        {(value === 0 && (
          <div className="mb-4">
            {promotions.map((item, index) => (
              <Promotion key={index} promotion={item} onClick={() => setShowDialog(true)} />
            ))}
          </div>
        )) || (
          <div className="mb-4">
            {promotions.map((item, index) => (
              <Promotion key={index} promotion={item} onClick={() => setShowDialog(true)} />
            ))}
          </div>
        )}
      </div>
      <PromotionDetailDialog isOpen={showDialog} onClose={() => setShowDialog(false)} />
    </div>
  );
};

export default PromotionsPage;
