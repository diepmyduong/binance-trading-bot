import React, { useEffect, useState } from "react";
import Menu from "./menu";
import SwitchTabs from "../../../../shared/utilities/tab/switch-tabs";
interface Propstype extends ReactProps {}
const Menus = (props) => {
  const food = [
    {
      title: "Món cơm",
      list: [
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: 49000, img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: 49000, img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: 49000, img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: 49000, img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: 49000, img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: 49000, img: "" },
      ],
    },
    {
      title: "Món canh",
      list: [
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: 49000, img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: 49000, img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: 49000, img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: 49000, img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: 49000, img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: 49000, img: "" },
      ],
    },
    {
      title: "Nước",
      list: [
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: 49000, img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: 49000, img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: 49000, img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: 49000, img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: 49000, img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: 49000, img: "" },
      ],
    },
    {
      title: "Món xào",
      list: [
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: 49000, img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: 49000, img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: 49000, img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: 49000, img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: 49000, img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: 49000, img: "" },
      ],
    },
    {
      title: "Món Chiên",
      list: [
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: 49000, img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: 49000, img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: 49000, img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: 49000, img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: 49000, img: "" },
        { name: "Cơm 1 người ăn", sold: 300, des: "Cơm + trứng + canh", price: 49000, img: "" },
      ],
    },
  ];
  const [isViewing, setIsViewing] = useState(0);
  const [isClickView, setIsClickView] = useState(false);
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
    if (!isClickView && menus && menus.length > 0) {
      scrollCheckInterval = setInterval(() => {
        for (let index = 0; index < menus.length; index++) {
          let position = isInViewport(menus[index]);
          if (position) {
            setTimeout(() => {
              setIsViewing(index);
              clearInterval(scrollCheckInterval);
            }, 300);
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
    console.log(index);
    setIsClickView(true);
    setIsViewing(index);
    setTimeout(() => {
      document.getElementsByClassName("menu-container")[index].scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "start",
      });
    }, 400);
    setTimeout(() => {
      setIsClickView(false);
    }, 300);
  };

  return (
    <div className="main-container relative">
      <SwitchTabs
        chevron
        value={isViewing}
        className=" sticky top-10 bg-white z-20 pt-3"
        native
        options={[
          ...food.map((item, index) => {
            return { value: index, label: item.title };
          }),
        ]}
        onChange={(val) => handleChange(val)}
      />
      {food.map((item, index) => (
        <Menu list={item.list} title={item.title} key={index} />
      ))}
    </div>
  );
};

export default Menus;
