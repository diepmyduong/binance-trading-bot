import React from "react";
import { Dialog, DialogPropsType } from "../../../../shared/utilities/dialog/dialog";
import { Input } from "../../../../shared/utilities/form/input";
import { Button } from "../../../../shared/utilities/form/button";
import Promotion from "./promotion";
import { TabGroup } from "../../../../shared/utilities/tab/tab-group";
interface Propstype extends DialogPropsType {}
const PromotionsDialog = (props: Propstype) => {
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
  return (
    <Dialog isOpen={props.isOpen} onClose={props.onClose} title="Mã khuyến mãi">
      <div className="flex flex-col text-sm sm:text-base overscroll-y-auto main-container">
        <div className="flex my-4 relative">
          <Input placeholder="Nhập mã giảm giá ở đây" />{" "}
          <Button className="absolute right-0" primary text="Áp dụng" />
        </div>
        <TabGroup>
          <TabGroup.Tab label="Khuyến mãi của quán">
            <div className="my-4">
              {promotions.map((item, index) => (
                <Promotion key={index} promotion={item} />
              ))}
            </div>
          </TabGroup.Tab>
          <TabGroup.Tab label="Khuyến mãi của tôi">
            <div className="my-4">
              {promotions.map((item, index) => (
                <Promotion key={index} promotion={item} />
              ))}
            </div>
          </TabGroup.Tab>
        </TabGroup>
      </div>
    </Dialog>
  );
};

export default PromotionsDialog;
