import { HiMinusCircle, HiPlusCircle } from "react-icons/hi";
import { useEffect } from "react";

interface PropsType extends ReactProps {
  inputClassName?: string;
  buttonClassName?: string;
  quantity: number;
  disabled?: boolean;
  setQuantity: Function;
}
export function Quantity(props: PropsType) {
  const handleSetQuantity = (value) => {
    if (value < 0) props.setQuantity(0);
    else props.setQuantity(value);
  };

  let buttonStyle = `btn-default text-primary p-0 w-8 h-10 text-32}`;

  return (
    <>
      <div className="flex items-center py-2.5 md:py-1">
        <button
          className={`${buttonStyle} ${props.buttonClassName || ""}`}
          disabled={props.disabled}
          onClick={() => handleSetQuantity(props.quantity - 1)}
        >
          <i>
            <HiMinusCircle />
          </i>
        </button>
        <input
          className={"w-6 h-10 text-center " + props.inputClassName}
          value={props.quantity}
          type="number"
          readOnly={props.disabled}
          onChange={(e) => handleSetQuantity(Number(e.target.value))}
        />
        <button
          className={`${buttonStyle} ${props.buttonClassName || ""}`}
          disabled={props.disabled}
          onClick={() => handleSetQuantity(props.quantity + 1)}
        >
          <i>
            <HiPlusCircle />
          </i>
        </button>
      </div>
    </>
  );
}
