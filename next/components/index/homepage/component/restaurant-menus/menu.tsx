import React, { useState } from "react";
import Rating from "../../../../shared/infomation/rating";
import { NumberPipe } from "../../../../../lib/pipes/number";
import { Img } from "../../../../shared/utilities/img";
import Price from "../../../../shared/infomation/price";
import { useCartContext } from "../../../../../lib/providers/cart-provider";
import { Form } from "../../../../shared/utilities/form/form";
import { useRouter } from "next/router";
import { Product } from "../../../../../lib/repo/product.repo";
interface PropsType extends ReactProps {
  list: Product[];
  title: string;
}
const Menu = (props: PropsType) => {
  const { handleChange } = useCartContext();
  const router = useRouter();
  const query = router.query;
  return (
    <div id={props.title} className="relative menu bg-white">
      <div className=" absolute -top-28 menu-container"></div>
      <p className="font-semibold text-primary py-2 pl-4 text-lg">{props.title}</p>
      {props.list.length > 0 && (
        <>
          {props.list.map((item: Product, index: number) => (
            <div
              key={index}
              className="flex justify-evenly items-center py-2 px-4 hover:bg-primary-light cursor-pointer border-b transition-all duration-300"
              onClick={() => {
                router.replace({ query: { ...query, productId: item.code }, path: "/" });
              }}
            >
              <div className="flex-1">
                <p>{item.name}</p>
                <Rating rating={item.rating || 4.8} numRated={item.rating || 688} textSm />
                <p className="text-gray-400 text-sm">{item.des}</p>
                <Price price={item.basePrice} textDanger />
              </div>
              <Img src={item.image} className="w-24 h-24 rounded-sm" />
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Menu;
