import { useState } from "react";
import { VscDiffAdded, VscDiffRemoved } from "react-icons/vsc";

interface PropsType extends ReactProps {
  onDecrease?: () => void;
  onIncrease?: () => void;
  onChange?: () => void;
  className?: string;
}
export function IncreaseButton({ onDecrease, onIncrease, onChange, className }: PropsType) {
  const [amount, setAmount] = useState(0);
  const handleClick = (number) => {
    if (amount + number >= 0) {
      setAmount(amount + number);
    }
  };

  return (
    <div className={`flex items-center justify-center text-gray-500 ${className}`}>
      <i className={`text-2xl ${amount > 0 && "text-primary"}`} onClick={() => handleClick(-1)}>
        <VscDiffRemoved />
      </i>
      <p className={`text-lg px-3 `}>{amount}</p>
      <i className={`text-2xl text-primary`} onClick={() => handleClick(1)}>
        <VscDiffAdded />
      </i>
    </div>
  );
}
