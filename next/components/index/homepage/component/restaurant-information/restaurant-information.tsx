import React from "react";
import { Img } from "../../../../shared/utilities/img";
import DefaultInfomation from "./default-infomation";
import MoreInfomation from "./more-infomation";
import SlidePromtion from "./banner-promtion";

const RestaurantInformation = (props) => {
  return (
    <div className="relative text-sm bg-white">
      <Img src="" ratio169 />
      <DefaultInfomation className="absolute m-3 p-3 top-32 main-container" />
      <MoreInfomation className="pt-40" />
      <SlidePromtion />
    </div>
  );
};

export default RestaurantInformation;
