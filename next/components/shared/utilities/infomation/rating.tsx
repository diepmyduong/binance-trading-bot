import React from "react";
import { HiStar } from "react-icons/hi";
interface Propstype extends ReactProps {
  rating: number | string;
  numRated: number | string;
}

const Rating = (props: Propstype) => {
  return (
    <div className="flex items-center">
      <i className="text-warning text-lg">
        <HiStar />
      </i>
      <span className="font-bold mx-1">{props.rating}</span>
      <p className="text-gray-400"> ({props.numRated}+)</p>
    </div>
  );
};

export default Rating;
