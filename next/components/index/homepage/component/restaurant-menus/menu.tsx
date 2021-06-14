import React from "react";
import Rating from "../../../../shared/utilities/infomation/rating";
import { NumberPipe } from "../../../../../lib/pipes/number";
import { Img } from "../../../../shared/utilities/img";
import Price from "../../../../shared/utilities/infomation/price";
interface PropsType extends ReactProps {
  list: {
    name: string;
    sold: number | string;
    des: string;
    price: string;
    img: string;
    rating?: number | string;
  }[];
  title: string;
}
const Menu = (props: PropsType) => {
  return (
    <div id={props.title} className="relative menu">
      <div className=" absolute -top-28 menu-container"></div>
      <p className="font-semibold text-primary">{props.title}</p>
      {props.list.map((item, index) => (
        <div key={index} className="flex py-2 items-center">
          <div className="flex-1">
            <p>{item.name}</p>
            <Rating rating={item.rating || 4.8} numRated={item.rating || 688} textSm />
            <p className="text-gray-400 text-sm">{item.des}</p>
            <Price price={item.price} textDanger />
          </div>
          <Img className="w-24 h-24 rounded-md" />
        </div>
      ))}
    </div>
  );
};

export default Menu;
