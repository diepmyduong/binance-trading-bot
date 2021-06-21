import React, { useEffect, useState } from "react";
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
      <Img
        src="https://file.hstatic.net/200000043306/file/trang-chu-pc-24-09-2020-1-02-4_d9ed746c78e148db9c3c9f42e1ffe9bb.png"
        ratio169
        className="bannerShop"
      />
      <DefaultInfomation
        className="center-item p-3 top-1/4 w-11/12"
        info={{ name: props.shop.shopName, address: props.shop.address }}
      />
      <MoreInfomation className="pt-20" />
      <BannerPromtion />
    </div>
  );
};

export default RestaurantInformation;
