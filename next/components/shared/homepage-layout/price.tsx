import React from "react";
import { NumberPipe } from "../../../lib/pipes/number";
interface Propstype extends ReactProps {
  price: string | number;
  textDanger?: boolean;
  downPrice?: string | number;
  saleRate?: string | number;
}

export function Price(props: Propstype) {
  return (
    <div className={`${props.className || ""} transition-all duration-200 flex`}>
      <p className={`${(props.textDanger && "text-danger") || "text-gray-800"} font-bold text-sm`}>
        {NumberPipe(props.price, true)}
      </p>
      {(props.downPrice && (
        <div className="flex items-center text-sm pl-2 ">
          <span className={`line-through pr-2 font-semibold`}>
            {NumberPipe(props.downPrice, true)}
          </span>
        </div>
      )) ||
        ""}
    </div>
  );
}
