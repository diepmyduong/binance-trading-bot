import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation } from "swiper/core";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

SwiperCore.use([Navigation]);
interface Propstype extends ReactProps {
  reactions: any[];
}
export function EmotionsEvaluate(props: Propstype) {
  return (
    <div className="relative group">
      <Swiper
        spaceBetween={10}
        freeMode={true}
        grabCursor
        slidesPerView={"auto"}
        className="w-auto"
      >
        {props.reactions.map((item, index) => (
          <SwiperSlide key={index} className="w-auto">
            <div className="flex-1 flex bg-primary-light rounded-full mr-3 items-center p-1.5 emotion">
              <i className="mr-1.5">{item.icon}</i>
              <p>
                {item.name} ({item.value})
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
