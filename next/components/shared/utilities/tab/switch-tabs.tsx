import React, { useEffect, useState } from "react";
import { Button } from "../form/button";
import useDebounce from "../../../../lib/hooks/useDebounce";
interface Propstype extends FormControlProps {
  options: { value: any; label: string; icon?: JSX.Element }[];
  native?: boolean;
  width?: number;
  value?: any;
}
const SwitchTabs = ({ native = false, ...props }: Propstype) => {
  const [value, setValue] = useState<any>(props.value);
  const [clickToView, setClickToView] = useState(false);
  const [style, setStyle] = useState({ width: 0, left: 0 });
  function handleChangeTab(index: number) {
    setClickToView(true);
    setValue(index);
    setTimeout(() => {
      setClickToView(false);
    }, 300);
  }
  const debounceValue = useDebounce(props.value, 300);
  useEffect(() => {
    if (!clickToView) {
      setValue(debounceValue);
      let selected = document.getElementsByClassName("tab")[debounceValue];
      selected.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [debounceValue]);
  useEffect(() => {
    let selected = document.getElementsByClassName("tab")[value];
    if (selected) {
      let bounding = selected.getBoundingClientRect();
      if (bounding) {
        let tabs = document.getElementsByClassName("tab");
        let left = 0;
        for (let index = 0; index < value; index++) {
          let res = tabs[index].getBoundingClientRect();
          if (res) {
            left += res.width;
          }
        }
        setStyle({ ...style, width: bounding.width, left });
      }
    }
    if (clickToView) {
      props.onChange(value);
    }
  }, [value]);
  return (
    <div className={`flex relative overflow-x-scroll ${props.className || ""}`}>
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
              className={`flex-1 p-2 tab whitespace-nowrap font-bold cursor-pointer transition-all duration-300 ${
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
  );
};

export default SwitchTabs;
