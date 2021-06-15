import React from "react";
import { NumberPipe } from "../../../../../lib/pipes/number";
interface Propstype extends ReactProps {
  totalFood: string | number;
  totalMoney: string | number;

  onClick?: Function;
}

const FloatingButton = (props: Propstype) => {
  return (
    <div
      className={`z-100 flex fixed bottom-2 left-2 text-sm btn-primary main-container`}
      onClick={() => props.onClick()}
    >
      <p className="flex-1">Giỏ hàng</p>
      <p className="flex-1">
        {props.totalFood} món - {NumberPipe(props.totalMoney, true)}
      </p>
    </div>
  );
};

export default FloatingButton;
