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
    <div className={`${props.className || ""}`}>
      {props.downPrice ? (
        <div className="flex items-center">
          <p
            className={`${
              (props.textDanger && "text-danger") || "text-gray-800"
            } font-bold text-sm pr-2`}
          >
            {NumberPipe(props.downPrice, true)}
          </p>
          <div className="flex items-center text-sm ">
            <span className={`line-through pr-2`}>{NumberPipe(props.price, true)}</span>
            {props.saleRate > 0 && (
              <span className="bg-danger text-white px-2 rounded-sm font-bold">
                {props.saleRate}
              </span>
            )}
          </div>
        </div>
      ) : (
        <p
          className={`${(props.textDanger && "text-danger") || "text-gray-800"} font-bold text-sm`}
        >
          {NumberPipe(props.price, true)}
        </p>
      )}
    </div>
  );
}
