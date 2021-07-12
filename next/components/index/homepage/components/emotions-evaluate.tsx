import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation } from "swiper/core";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Dialog } from "../../../shared/utilities/dialog/dialog";

SwiperCore.use([Navigation]);
interface Propstype extends ReactProps {
  reactions: { name: string; icon: string; qty: number }[];
  shopName: string;
}
export function EmotionsEvaluate(props: Propstype) {
  const [reactSelected, setReactSelected] = useState<{ name: string; icon: string; qty: number }>(
    null
  );
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
            <div
              className="flex-1 flex bg-primary-light rounded-full mr-3 items-center p-1.5 emotion"
              onClick={() => setReactSelected(item)}
            >
              {item.icon}
              <p className="pl-2">
                {item.name} ({item.qty})
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <Dialog
        title="Đánh giá"
        isOpen={reactSelected ? true : false}
        onClose={() => setReactSelected(null)}
        slideFromBottom="all"
        mobileSizeMode
      >
        <div className=" flex flex-col py-4 text-center max-w-lg">
          <span className="text-32 py-2">{reactSelected?.icon}</span>
          <span className="text-28 py-2">{reactSelected?.name}</span>
          <span className=" py-2">{reactSelected?.qty}+ khách hàng đã đánh giá như vậy</span>
          <span className=" py-2">
            Hãy cùng {props.shopName} nâng cao chất lượng quán bằng cách đánh giá sau khi đơn hàng
            kết thúc bạn nhé
          </span>
        </div>
      </Dialog>
    </div>
  );
}
