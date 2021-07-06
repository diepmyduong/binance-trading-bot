import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation } from "swiper/core";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

SwiperCore.use([Navigation]);
interface Propstype extends ReactProps {
  reactions: { name: string; icon: string; qty: number }[];
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
              {item.icon}
              <p className="pl-2">
                {item.name} ({item.qty})
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
