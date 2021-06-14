import React from "react";
import { NumberPipe } from "../../../../../lib/pipes/number";
import { Img } from "../../../../shared/utilities/img";
import Price from "../../../../shared/utilities/infomation/price";
import { useCartContext } from "../../../../../lib/providers/cart-provider";
interface Propstype extends ReactProps {}
const MustTryMenu = (props: Propstype) => {
  const tryFood = [
    {
      img: "",
      name: "Combo 2 người",
      price: "119000",
    },
    {
      img: "",
      name: "Combo 3 người",
      price: "149000",
    },
    {
      img: "",
      name: "Combo 4 người",
      price: "199000",
    },
    {
      img: "",
      name: "Combo 5 người",
      price: "249000",
    },
  ];
  const { handleChange } = useCartContext();
  return (
    <div className="main-container">
      <h3 className="font-semibold pb-2">Nhất định phải thử</h3>
      <div className="flex flex-wrap text-sm gap-3">
        {tryFood.map((item, index) => (
          <div
            className="flex-1"
            key={index}
            onClick={() => {
              handleChange(-1, item);
            }}
          >
            <Img src={item.img} ratio169 className="min-w-4xs rounded-sm" />
            <p>{item.name}</p>
            <Price price={item.price} textDanger />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MustTryMenu;
