import React from "react";
import { Img } from "../../../../shared/utilities/img";
import { NumberPipe } from "../../../../../lib/pipes/number";
import { useRouter } from "next/router";
interface Propstype extends ReactProps {
  product: {
    code: string;
    name: string;
    type: string;
    price: string | number;
    img: string;
    unit: string;
  };
}
const ProductCard = (props: Propstype) => {
  const router = useRouter();
  return (
    <div
      className="cursor-pointer w-28 space-y-2 text-sm sm:text-base transition-colors duration-300 hover:text-primary"
      onClick={() => router.push("/details/" + props.product.code)}
    >
      <Img src={props.product.img} className="shadow-md w-28 h-28" imageClassName="shadow-md" />
      <p className="text-gray-500 text-sm text-ellipsis">{props.product.type}</p>
      <p className="text-ellipsis-2 font-semibold">{props.product.name}</p>
      <p className="text-accent">
        {NumberPipe(props.product.price, true)}/{props.product.unit || "cái"}
      </p>
    </div>
  );
};

export default ProductCard;
