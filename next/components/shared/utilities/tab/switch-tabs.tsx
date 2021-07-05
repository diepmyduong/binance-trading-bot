import React, { useEffect, useState } from "react";
import useDebounce from "../../../../lib/hooks/useDebounce";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import useDevice from "../../../../lib/hooks/useDevice";
interface Propstype extends FormControlProps {
  options?: { value: any; label: string; icon?: JSX.Element }[];
  native?: boolean;
  width?: number;
  value?: any;
  chevron?: boolean;
}
export function SwitchTabs({ native = false, chevron = false, ...props }: Propstype) {
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
    if (!clickToView && chevron) {
      setValue(debounceValue);
      let selected = document.getElementsByClassName("tab")[debounceValue];
      if (selected) {
        selected.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
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
  const { isMobile } = useDevice();
  return (
    <div className={`relative group w-full ${props.className || ""}`}>
      {!isMobile && chevron && (
        <>
          {!isLastLeft && (
            <button
              className={`z-30 focus:outline-none absolute left-0 my-0 bottom-0 py-2 hover:bg-primary-light rounded-full  text-primary transition-all duration-300 opacity-0 group-hover:opacity-80
              hover:opacity-100 hover:text-primary-dark`}
              onClick={() => scrollTo(true)}
            >
              <i className="text-32">
                <FaChevronLeft />
              </i>
            </button>
          )}
          {!isLastRight && (
            <button
              className={`z-30 focus:outline-none absolute  right-0 my-0 bottom-0 py-2 hover:bg-primary-light rounded-full text-primary transition-all duration-300 opacity-0 group-hover:opacity-80
              hover:opacity-100 hover:text-primary-dark`}
              onClick={() => scrollTo(false)}
            >
              <i className="text-32">
                <FaChevronRight />
              </i>
            </button>
          )}
        </>
      )}
      <div
        className={`flex relative border-b   ${
          (isMobile && " overflow-x-scroll") || "overflow-hidden"
        } ${!native && " border-group rounded-md "}`}
      >
        {props.options.map(
          (item, index) =>
            (!native && (
              <button
                className={`flex-1 p-2 tab whitespace-nowrap ${
                  item.value === props.value ? "btn-primary" : "btn-outline"
                }`}
                onClick={() => props.onChange(item.value)}
                key={index}
              >
                {item.label}
              </button>
            )) || (
              <a
                className={`${
                  chevron && "tab "
                } text-center hover:text-gray-800 hover:bg-primary-light flex-1 px-2 py-3 whitespace-nowrap font-bold cursor-pointer transition-all duration-300 ${
                  (item.value !== value && "text-gray-400") || "text-gray-800"
                } ${!item.label ? "hidden" : ""}`}
                key={index}
                onClick={() => handleChangeTab(item.value)}
              >
                {item.label}
              </a>
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
}
