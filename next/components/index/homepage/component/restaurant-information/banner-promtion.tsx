import React from "react";
import { Img } from "../../../../shared/utilities/img";
import { Swiper, SwiperSlide } from "swiper/react";
interface Propstype extends ReactProps {}
const BannerPromtion = (props: ReactProps) => {
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
        spaceBetween={50}
        slidesPerView={1}
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => console.log(swiper)}
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
