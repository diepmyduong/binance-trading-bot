import React, { useState } from "react";
import { Img } from "../../../../shared/utilities/img";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Pagination, Autoplay } from "swiper/core";
// install Swiper modules
SwiperCore.use([Pagination, Autoplay]);
interface Propstype extends ReactProps {}
const BannerPromtion = (props: Propstype) => {
  const promotions = [
    {
      img: "",
      name: "",
      code: "",
    },
    {
      img: "",
      name: "",
      code: "",
    },
    {
      img: "",
      name: "",
      code: "",
    },
  ];
  return (
    <div className={`mt-4 ${props.className} `}>
      <Swiper
        spaceBetween={10}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
      >
        {promotions.map((item, index) => (
          <SwiperSlide key={index}>
            <Img key={index} src={item.img || "/assets/default/default.png"} ratio169 />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerPromtion;
