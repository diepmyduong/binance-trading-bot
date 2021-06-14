import React from "react";
import Price from "../../../shared/utilities/infomation/price";
import { Img } from "../../../shared/utilities/img";
import { AiOutlineClose } from "react-icons/ai";
interface Propstype extends ReactProps {
  cart: { qty: number; name: string; note?: string; img: string; price: number | string }[];
  onRemove: Function;
}

const ListCart = (props: Propstype) => {
  return (
    <div className=" main-container text-sm ">
      {props.cart.map((item, index) => (
        <div className="flex items-center py-1.5 border-b" key={index}>
          <div className="flex-1 leading-7">
            <p>
              <span className="text-primary font-semibold">{item.qty} X </span>
              {item.name}
            </p>
            <Price price={item.price} />
            {item.note && <p className="text-gray-500">Ghi chú: {item.note}</p>}
          </div>
          <div className="flex items-center">
            <Img className="w-14 h-14" src={item.img} />
            <i
              className="font-semibold text-lg rounded-full bg-gray-50 ml-2 p-0.5 text-gray-600"
              onClick={() => props.onRemove(index)}
            >
              <AiOutlineClose />
            </i>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListCart;
