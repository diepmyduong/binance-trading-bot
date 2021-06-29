import React from "react";
import { HiStar } from "react-icons/hi";
interface Propstype extends ReactProps {
  rating: number | string;
  numRated?: number | string;
  textSm?: boolean;
  textLg?: boolean;
  ratingTime?: string;
}

const Rating = (props: Propstype) => {
  return (
    <div
      className={`${
        (props.textSm && "text-sm") || (props.textLg && "text-lg") || ""
      }  flex items-center `}
    >
      <i
        className={`${
          (props.textSm && "text-sm") || (props.textLg && "text-lg") || ""
        } text-warning `}
      >
        <HiStar />
      </i>
      <span className="font-bold mx-1">{props.rating}</span>
      {props.numRated && <p className="text-gray-400"> ({props.numRated}+)</p>}
      {props.ratingTime && <p className="text-gray-400 text-sm"> {props.ratingTime}</p>}
    </div>
  );
};

export default Rating;
