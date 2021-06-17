import React from "react";
import { Img } from "../../../../shared/utilities/img";
import DefaultInfomation from "./default-infomation";
import MoreInfomation from "./more-infomation";
import BannerPromtion from "./banner-promtion";
import { Shop } from "../../../../../lib/repo/shop.repo";
interface Propstype extends ReactProps {
  shop: Shop;
}

const RestaurantInformation = (props: Propstype) => {
  return (
    <div className="relative text-sm bg-white">
      <Img src="" ratio169 />
      <DefaultInfomation
        className="absolute left-3 p-3 top-32 w-11/12"
        info={{ name: props.shop.shopName, address: props.shop.address }}
      />
      <MoreInfomation className="pt-20" />
      <BannerPromtion />
    </div>
  );
};

export default RestaurantInformation;
