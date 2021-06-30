import React from "react";
import { NumberPipe } from "../../../../../lib/pipes/number";
interface Propstype extends ReactProps {
  totalFood: string | number;
  totalMoney: string | number;

  onClick?: Function;
}

const FloatingButton = (props: Propstype) => {
  return (
    <div className="w-full mt-3 sticky bottom-5 sm:bottom-7 left-0 flex flex-col items-center z-100">
      <div className="max-w-lg flex flex-col items-center w-full px-4">
        <button
          className={`z-50 flex text-sm btn-primary mx-4 w-full max-w-sm sm:h-14`}
          onClick={() => props.onClick()}
        >
          <span className="flex-1">Giỏ hàng</span>
          <span className="flex-1 text-right whitespace-nowrap pl-4">
            {props.totalFood} món - {NumberPipe(props.totalMoney, true)}
          </span>
        </button>
      </div>
    </div>
  );
};

export default FloatingButton;
