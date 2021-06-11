import React from "react";
import { NumberPipe } from "../../../../../lib/pipes/number";
import { Img } from "../../../../shared/utilities/img";

const MustTryMenu = (props) => {
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
  return (
    <div className="main-container">
      <h3 className="font-semibold pb-2">Nhất định phải thử</h3>
      <div className="flex flex-wrap text-sm gap-2">
        {tryFood.map((item, index) => (
          <div className="flex-1" key={index}>
            <Img src={item.img} ratio169 className=" min-w-4xs" />
            <p>{item.name}</p>
            <p className="font-bold text-primary">{NumberPipe(item.price, true)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MustTryMenu;
