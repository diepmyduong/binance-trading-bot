import React from "react";
import { HiStar } from "react-icons/hi";
interface Propstype extends ReactProps {
  rating: number | string;
  numRated: number | string;
  textSm?: boolean;
  textLg?: boolean;
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
      <p className="text-gray-400"> ({props.numRated}+)</p>
    </div>
  );
};

export default Rating;
