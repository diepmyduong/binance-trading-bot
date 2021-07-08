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
        <div className="flex items-center text-sm pl-2">
          <span className={`line-through pr-2`}>{NumberPipe(props.downPrice, true)}</span>
          {props.saleRate > 0 && (
            <div className="bg-red-500 text-white text-xs rounded px-2">{props.saleRate || 0}%</div>
          )}
        </div>
      )) ||
        ""}
    </div>
  );
}
