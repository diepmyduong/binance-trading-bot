import React from "react";
import { NumberPipe } from "../../../../../lib/pipes/number";
interface Propstype extends ReactProps {
  totalFood: string | number;
  totalMoney: string | number;

  onClick?: Function;
}

const FloatingButton = (props: Propstype) => {
  return (
    <div className="w-full fixed bottom-2 left-0 flex flex-col items-center">
      <div className="max-w-lg flex flex-col items-center w-full px-4">
        <div
          className={`z-50 flex text-sm btn-primary mx-4 w-full`}
          onClick={() => props.onClick()}
        >
          <p className="flex-1">Giỏ hàng</p>
          <p className="flex-1 text-right whitespace-nowrap pl-4">
            {props.totalFood} món - {NumberPipe(props.totalMoney, true)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FloatingButton;
