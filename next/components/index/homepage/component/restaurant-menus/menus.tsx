import React, { useEffect, useState } from "react";
import Menu from "./menu";
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
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom / 2 <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
  function menuScrollEvent() {
    let scrollCheckInterval = null;
    let menus = document.getElementsByClassName("menu");
    if (menus && menus.length > 0) {
      scrollCheckInterval = setInterval(() => {
        for (let index = 0; index < menus.length; index++) {
          let position = isInViewport(menus[index]);
          if (position) {
            let task = [];
            let titleViewing = document.getElementsByClassName("title")[index];
            if (!isInViewport(titleViewing)) {
              task.push(
                titleViewing.scrollIntoView({
                  behavior: "smooth",
                  block: "nearest",
                  inline: "center",
                })
              );
            }
            setTimeout(() => {
              if (task.length) {
                Promise.all(task);
              }
              setIsViewing(index);
              clearInterval(scrollCheckInterval);
            }, 400);
            break;
          }
        }
      }, 300);
    }
  }
  useEffect(() => {
    document.addEventListener("scroll", menuScrollEvent, {
      passive: true,
    });
    return () => {
      document.removeEventListener("scroll", menuScrollEvent);
    };
  }, []);
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
    }, 700);
  };

  return (
    <div className="main-container relative">
      <div className="flex overflow-auto sticky top-12 bg-white z-20 pt-3">
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
