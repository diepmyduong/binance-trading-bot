import React from "react";
import { Img } from "../../../../shared/utilities/img";
interface Propstype extends ReactProps {}
const SlidePromtion = (props: ReactProps) => {
  const promotions = [
    {
      img: "",
      name: "",
      code: "",
    },
    {
      img: "",
      name: "",
      code: "",
    },
    {
      img: "",
      name: "",
      code: "",
    },
  ];
  return (
    <div className={`flex gap-3 py-2 sm:gap-4 overflow-auto min-h-28 max-w-xs  ${props.className}`}>
      {promotions.map((item, index) => (
        <Img
          key={index}
          src={item.img || "/assets/default/default.png"}
          className="border min-w-2xs max-h-4xs"
          ratio169
          style={{
            scrollBehavior: "smooth",
          }}
        />
      ))}
    </div>
  );
};

export default SlidePromtion;
