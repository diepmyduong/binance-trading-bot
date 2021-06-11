import React from "react";
import { NumberPipe } from "../../../../lib/pipes/number";
interface Propstype extends ReactProps {
  price: string | number;
}

const Price = (props: Propstype) => {
  return <p className="text-gray-800 font-bold text-sm">{NumberPipe(props.price, true)}</p>;
};

export default Price;
