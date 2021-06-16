import React, { useEffect, useState } from "react";
import { Button } from "../form/button";
import useDebounce from "../../../../lib/hooks/useDebounce";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import useScreen from "../../../../lib/hooks/useScreen";
interface Propstype extends FormControlProps {
  options?: { value: any; label: string; icon?: JSX.Element }[];
  native?: boolean;
  width?: number;
  value?: any;
  chevron?: boolean;
}
const SwitchTabs = ({ native = false, chevron = false, ...props }: Propstype) => {
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom / 2 <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
  const [value, setValue] = useState<any>(props.value);
  const [clickToView, setClickToView] = useState(false);
  const [isLastLeft, setIsLastLeft] = useState(false);
  const [isLastRight, setIsLastRight] = useState(false);
  const [style, setStyle] = useState({ width: 0, left: 0, height: 0 });
  function handleChangeTab(index: number) {
    setClickToView(true);
    setValue(index);
    setTimeout(() => {
      checkLeftnRight();
    }, 500);
    setTimeout(() => {
      setClickToView(false);
    }, 300);
  }
  const debounceValue = useDebounce(props.value, 200);
  useEffect(() => {
    if (!clickToView) {
      setValue(debounceValue);
      let selected = document.getElementsByClassName("tab")[debounceValue];
      selected.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
      setTimeout(() => {
        checkLeftnRight();
      }, 500);
    }
  }, [debounceValue]);
  const debounceValue2 = useDebounce(value, 200);
  useEffect(() => {
    let selected = document.getElementsByClassName("tab")[debounceValue2];
    if (selected) {
      let bounding = selected.getBoundingClientRect();
      if (bounding) {
        let tabs = document.getElementsByClassName("tab");
        let left = 0;
        for (let index = 0; index < debounceValue2; index++) {
          let res = tabs[index].getBoundingClientRect();
          if (res) {
            left += res.width;
          }
        }
        setStyle({ ...style, width: bounding.width, left, height: bounding.height });
      }
    }
    if (clickToView) {
      props.onChange(debounceValue2);
    }
  }, [debounceValue2]);
  function checkLeftnRight() {
    let lastLeft = document.getElementsByClassName("tab")[0];
    let lastRight = document.getElementsByClassName("tab")[props.options.length - 1];
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
    let tabs = document.getElementsByClassName("tab");
    if (left) {
      for (let index = value; index >= 0; index--) {
        if (!isInViewport(tabs[index])) {
          tabs[index].scrollIntoView({
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
      for (let index = value; index < tabs.length; index++) {
        if (!isInViewport(tabs[index])) {
          tabs[index].scrollIntoView({
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
  return (
    <div className={`relative group w-full ${props.className || ""}`}>
      {chevron && (
        <>
          {!isLastLeft && (
            <button
              className={`z-100 focus:outline-none absolute left-0 my-0 bottom-1 p-4 bg-primary-light text-primary transition-all duration-300 opacity-100 sm:opacity-0 group-hover:opacity-80
              hover:opacity-100 hover:bg-primary hover:text-white`}
              onClick={() => scrollTo(true)}
            >
              <i className="">
                <FaChevronLeft />
              </i>
            </button>
          )}
          {!isLastRight && (
            <button
              className={`z-100 focus:outline-none absolute  right-0 my-0 bottom-1 p-4 bg-primary-light text-primary transition-all duration-300 opacity-100 sm:opacity-0 group-hover:opacity-80
              hover:opacity-100 hover:bg-primary hover:text-white`}
              onClick={() => scrollTo(false)}
            >
              <i className="">
                <FaChevronRight />
              </i>
            </button>
          )}
        </>
      )}
      <div
        className={`flex relative my-2  ${(chevron && "overflow-hidden") || " overflow-x-scroll"}`}
      >
        {props.options.map(
          (item) =>
            (!native && (
              <Button
                className={`flex-1 p-2 tab whitespace-nowrap ${
                  !native && item.value === value && "btn-info"
                } ${(item.value !== value && "text-gray-400") || "text-primary"}`}
                onClick={() => handleChangeTab(item.value)}
                key={item.value}
                text={item.label}
                icon={item.icon}
              />
            )) || (
              <p
                className={`hover:text-gray-800 hover:bg-primary-light flex-1 px-2 py-4 tab whitespace-nowrap font-bold cursor-pointer transition-all duration-300 ${
                  (item.value !== value && "text-gray-400") || "text-gray-800"
                }`}
                key={item.value}
                onClick={() => handleChangeTab(item.value)}
              >
                {item.label}
              </p>
            )
        )}
        {native && (
          <div
            className="absolute bottom-0 h-1 bg-primary transition-all ease-in-out duration-300"
            style={{ width: style.width, left: style.left }}
          ></div>
        )}
      </div>
    </div>
  );
};

export default SwitchTabs;
