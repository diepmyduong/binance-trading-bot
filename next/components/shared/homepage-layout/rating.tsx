import React from "react";
import { HiShoppingCart, HiStar } from "react-icons/hi";
import formatDate from "date-fns/format";
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
        {props.ratingTime && (
          <span className="text-gray-400 text-sm">
            {formatDate(new Date(props.ratingTime), "dd-MM-yyyy HH:mm")}
          </span>
        )}
      </div>
      {props.soldQty > 0 && (
        <div className="flex items-center text-sm">
          <i className="text-lg ml-3 pr-1">
            <HiShoppingCart />
          </i>
          <span className="text-gray-400">
            (
            {(props.soldQty > 1000 && "999+") ||
              (props.soldQty > 100 && "99+") ||
              (props.soldQty > 10 && "9+") ||
              props.soldQty}
            )
          </span>
        </div>
      )}
    </div>
  );
}
