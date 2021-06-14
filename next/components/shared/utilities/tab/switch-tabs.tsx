import React, { useEffect, useState } from "react";
import { Button } from "../form/button";
interface Propstype extends FormControlProps {
  options: { value: any; label: string; icon?: JSX.Element }[];
  native?: boolean;
  width?: number;
  value?: any;
}
const SwitchTabs = ({ native = false, ...props }: Propstype) => {
  const [value, setValue] = useState<any>();
  const [style, setStyle] = useState({ width: 0, left: 0 });
  useEffect(() => {
    if (props.width) {
      setStyle({ ...style, width: props.width });
    } else {
      setStyle({ ...style, width: 160 });
    }
    if (props.options) {
      let val = props.options[0].value;
      setValue(val);
    }
  }, []);
  useEffect(() => {
    let index = props.options.findIndex((item) => item.value === value);
    let leftNew = style.width * index;
    if (index !== -1) {
      setStyle({ ...style, left: leftNew });
    }
    document.getElementsByClassName("tab")[index].scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
    props.onChange(value);
  }, [value]);
  return (
    <div className={`flex relative ${props.className || ""}`}>
      {props.options.map((item) => (
        <Button
          className={`flex-1 tab whitespace-nowrap ${
            !native && item.value === value && "btn-info"
          }`}
          style={{ width: style.width }}
          onClick={() => setValue(item.value)}
          key={item.value}
          text={item.label}
          icon={item.icon}
        />
      ))}
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
