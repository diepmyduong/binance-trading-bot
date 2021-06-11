import React, { useEffect, useState } from "react";
import Menu from "./menu";
import { Swiper, SwiperSlide } from "swiper/react";
import useDebounce from "../../../../../lib/hooks/useDebounce";

const Menus = (props) => {
  const food = [
    {
      title: "Món cơm",
      list: [
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: "49000", img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: "49000", img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: "49000", img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: "49000", img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: "49000", img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: "49000", img: "" },
      ],
    },
    {
      title: "Món canh",
      list: [
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: "49000", img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: "49000", img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: "49000", img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: "49000", img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: "49000", img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: "49000", img: "" },
      ],
    },
    {
      title: "Nước",
      list: [
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: "49000", img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: "49000", img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: "49000", img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: "49000", img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: "49000", img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: "49000", img: "" },
      ],
    },
    {
      title: "Món xào",
      list: [
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: "49000", img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: "49000", img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: "49000", img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: "49000", img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: "49000", img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: "49000", img: "" },
      ],
    },
    {
      title: "Món Chiên",
      list: [
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: "49000", img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: "49000", img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: "49000", img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: "49000", img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: "49000", img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: "49000", img: "" },
      ],
    },
  ];
  const [isViewing, setIsViewing] = useState(0);
  const handleChange = async (index: number) => {
    document.getElementsByClassName("title")[index].scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
    setTimeout(() => {
      document.getElementsByClassName("menu-container")[index].scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "start",
      });
    }, 600);
    setTimeout(() => {
      setIsViewing(index);
    }, 600);
  };
  useEffect(() => {
    let interval = null;
    document.addEventListener(
      "scroll",
      function () {
        const menuPrev = document.getElementsByClassName("menu")[isViewing - 1];
        const menuNext = document.getElementsByClassName("menu")[isViewing + 1];
        if (menuNext) {
          let res = menuNext.getBoundingClientRect();
          if (res.top < 200 && !interval) {
            interval = setInterval(() => {
              document.getElementsByClassName("title")[isViewing + 1].scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "center",
              });
              setIsViewing(isViewing + 1);
              clearInterval(interval);
            }, 100);
          }
        }
        if (menuPrev) {
          let res = menuPrev.getBoundingClientRect();
          if (res.bottom > document.documentElement.clientHeight - 200 && !interval) {
            interval = setInterval(() => {
              document.getElementsByClassName("title")[isViewing - 1].scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "center",
              });
              setIsViewing(isViewing - 1);
              console.log("any");
              clearInterval(interval);
            }, 100);
          }
        }
      },
      {
        passive: true,
      }
    );
    return () => {
      clearInterval(interval);
    };
  }, [isViewing]);

  return (
    <div className="main-container relative">
      <div className="flex overflow-auto max-w-xs sticky top-12 bg-white z-20 pt-3">
        {food.map((item, index) => (
          <p
            key={index}
            onClick={() => handleChange(index)}
            className={`title font-semibold p-2 whitespace-nowrap ${
              (isViewing === index && "text-gray-800") || "text-gray-400"
            }`}
          >
            {item.title}
          </p>
        ))}
      </div>
      {food.map((item, index) => (
        <Menu list={item.list} title={item.title} key={index} />
      ))}
    </div>
  );
};

export default Menus;
