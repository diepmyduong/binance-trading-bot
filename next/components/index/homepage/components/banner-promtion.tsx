import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Pagination, Autoplay } from "swiper/core";
// install Swiper modules
SwiperCore.use([Pagination, Autoplay]);
interface Propstype extends ReactProps {}
const BannerPromtion = (props: Propstype) => {
  const promotions = [
    {
      img:
        "https://file.hstatic.net/200000043306/file/banner_web_mobile_83c075fe49b44d8a8267ccd829a8748d.png",
      name: "",
      code: "",
    },
    {
      img:
        "https://file.hstatic.net/200000043306/file/banner_web_mobile_83c075fe49b44d8a8267ccd829a8748d.png",

      name: "",
      code: "",
    },
    {
      img:
        "https://file.hstatic.net/200000043306/file/banner_web_mobile_83c075fe49b44d8a8267ccd829a8748d.png",

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
            <img key={index} src={item.img || "/assets/default/default.png"} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerPromtion;
