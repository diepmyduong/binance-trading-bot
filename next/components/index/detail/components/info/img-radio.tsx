import React from "react";
import { Img } from "../../../../shared/utilities/img";
interface Propstype extends ReactProps {
  options: any[];
  onChange?: (e: any) => void;
}
const ImgRadio = (props: Propstype) => {
  return (
    <div className={`flex gap-2 sm:gap-4 overscroll-x-auto ` + props.className}>
      {props.options &&
        props.options.map((item, index) => (
          <Img
            key={index}
            src={item}
            className="h-20 w-20 sm:h-24 sm:w-24 rounded-sm"
            onClick={() => props.onChange(item)}
          />
        ))}
    </div>
  );
};

export default ImgRadio;
