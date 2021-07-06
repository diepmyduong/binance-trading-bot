import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Pagination, Autoplay } from "swiper/core";
import { ShopBanner } from "../../../../lib/repo/banner.repo";
import { useRouter } from "next/router";
import { Img } from "../../../shared/utilities/img";
// install Swiper modules
SwiperCore.use([Pagination, Autoplay]);
interface Propstype extends ReactProps {
  banner: ShopBanner[];
}
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
  const router = useRouter();
  const query = router.query;
  const url = new URL(location.href);
  const handleClick = (banner: ShopBanner) => {
    switch (banner.actionType) {
      case "PRODUCT":
        {
          url.searchParams.set("productId", banner.product.code);
          router.push(url.toString(), null, { shallow: true });
        }
        break;
      case "WEBSITE":
        {
          router.push(banner.link);
        }
        break;
      case "VOUCHER":
        {
          router.push("/promotion");
        }
        break;
      default:
        break;
    }
  };
  return (
    <div className={`mt-4 ${props.className} `}>
      <Swiper
        spaceBetween={10}
        loop={true}
        autoplay={{
          delay: 8000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
      >
        {props.banner.map((item: ShopBanner, index) => (
          <SwiperSlide key={index} onClick={() => handleClick(item)} className="cursor-pointer">
            <div>
              <Img key={index} src={item.image || "/assets/default/default.png"} ratio169 />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerPromtion;
