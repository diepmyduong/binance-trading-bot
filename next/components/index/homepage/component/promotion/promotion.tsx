import React from "react";
import { Img } from "../../../../shared/utilities/img";
import { Button } from "../../../../shared/utilities/form/button";
interface Propstype extends ReactProps {
  promotion: any;
}

const Promotion = (props: Propstype) => {
  return (
    <div className="flex border-l-8 rounded-l-lg text-sm sm:text-base border-primary px-3 py-4 items-center shadow-lg mb-3">
      <Img src={props.promotion.img} className="w-14 h-14 rounded-md" />
      <div className="leading-7 flex-1 px-3">
        <p className="text-ellipsis">{props.promotion.name}</p>
        <p>{props.promotion.dated}</p>
      </div>
      <Button text="Xem" className="btn-sm sm:w-14 sm:h-14" />
    </div>
  );
};

export default Promotion;
