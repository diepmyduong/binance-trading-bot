import React from "react";
import { HiShoppingCart, HiStar } from "react-icons/hi";
interface Propstype extends ReactProps {
  rating: number | string;
  numRated?: number | string;
  textSm?: boolean;
  textLg?: boolean;
  ratingTime?: string;
  soldQty?: number;
}

export function Rating(props: Propstype) {
  return (
    <div className="flex items-center">
      <div className={`${props.textSm && "text-sm"}  flex items-center `}>
        <i className={`${props.textSm && "text-sm"} text-warning `}>
          <HiStar />
        </i>
        <span className="font-bold mx-1">{props.rating}</span>
        {props.numRated && <p className="text-gray-400"> ({props.numRated}+)</p>}
        {props.ratingTime && <p className="text-gray-400 text-sm"> {props.ratingTime}</p>}
      </div>
      {props.soldQty > 10 && (
        <div className="flex items-center text-sm">
          <i className="text-lg ml-3">
            <HiShoppingCart />
          </i>
          <p className="text-gray-400">
            (
            {(props.soldQty > 1000 && "999+") ||
              (props.soldQty > 100 && "99+") ||
              (props.soldQty > 10 && "9+")}
            )
          </p>
        </div>
      )}
    </div>
  );
}
