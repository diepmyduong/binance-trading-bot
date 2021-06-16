import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation } from "swiper/core";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import useDevice from "../../../../../lib/hooks/useDevice";

// install Swiper modules
SwiperCore.use([Navigation]);
interface Propstype extends ReactProps {
  reactions: any[];
}
const EmotionsEvaluate = (props: Propstype) => {
  const [isLastLeft, setIsLastLeft] = useState(false);
  const [isLastRight, setIsLastRight] = useState(false);
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom / 2 <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
  function checkLeftnRight() {
    let lastLeft = document.getElementsByClassName("emotion")[0];
    let lastRight = document.getElementsByClassName("emotion")[props.reactions.length - 1];
    if (lastLeft && isInViewport(lastLeft)) {
      setIsLastLeft(true);
    } else {
      setIsLastLeft(false);
    }
    if (lastRight && isInViewport(lastRight)) {
      setIsLastRight(true);
    } else {
      setIsLastRight(false);
    }
  }
  function scrollTo(left: boolean) {
    let emotions = document.getElementsByClassName("emotion");
    if (left) {
      for (let index = emotions.length - 1; index >= 0; index--) {
        if (!isInViewport(emotions[index])) {
          emotions[index].scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
          setTimeout(() => {
            checkLeftnRight();
          }, 200);
          break;
        }
      }
    } else {
      for (let index = 0; index < emotions.length; index++) {
        if (!isInViewport(emotions[index])) {
          emotions[index].scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
          setTimeout(() => {
            checkLeftnRight();
          }, 200);
          break;
        }
      }
    }
  }
  const { isMobile } = useDevice();
  return (
    <div className="relative group">
      <Swiper spaceBetween={10} freeMode={true} slidesPerView={"auto"} className="w-auto">
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
      {!isMobile && (
        <>
          {!isLastLeft && (
            <button
              className={`z-100 focus:outline-none absolute left-0 my-0 bottom-1 rounded-full text-primary transition-all duration-300 opacity-0 group-hover:opacity-50
              hover:opacity-100 hover:text-primary-dark`}
              onClick={() => scrollTo(true)}
            >
              <i className="text-28">
                <FaChevronLeft />
              </i>
            </button>
          )}
          {!isLastRight && (
            <button
              className={`z-100 focus:outline-none absolute  right-0 my-0 bottom-1 rounded-full text-primary transition-all duration-300 opacity-0 group-hover:opacity-50
          hover:opacity-100 hover:text-primary-dark`}
              onClick={() => scrollTo(false)}
            >
              <i className="text-28">
                <FaChevronRight />
              </i>
            </button>
          )}
        </>
      )}
      {/* <>
        <button
          className={`z-100 focus:outline-none absolute  left-0 my-0 bottom-1 p-2 bg-primary-light text-primary transition-all duration-300 opacity-100 sm:opacity-0 group-hover:opacity-80
              hover:opacity-100 hover:bg-primary hover:text-white`}
          onClick={() => scrollTo(true)}
        >
          <i className="">
            <FaChevronLeft />
          </i>
        </button>
        <button
          className={`z-100 focus:outline-none absolute  right-0 my-0 bottom-1 p-2 bg-primary-light text-primary transition-all duration-300 opacity-100 sm:opacity-0 group-hover:opacity-80
              hover:opacity-100 hover:bg-primary hover:text-white`}
          onClick={() => scrollTo(false)}
        >
          <i className="">
            <FaChevronRight />
          </i>
        </button>
      </>
      <div className="flex justify-between items-center overflow-x-hidden whitespace-nowrap">
        {props.reactions.map((item, key) => (
          <div
            key={key}
            className="flex bg-primary-light rounded-full mr-3 items-center p-1.5 emotion"
          >
            <i className="mr-1.5">{item.icon}</i>
            <p>
              {item.name} ({item.value})
            </p>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default EmotionsEvaluate;
