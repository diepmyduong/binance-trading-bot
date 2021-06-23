import { useEffect, useState } from "react";
import { VscDiffAdded, VscDiffRemoved } from "react-icons/vsc";

interface PropsType extends ReactProps {
  onDecrease?: () => void;
  onIncrease?: () => void;
  onChange?: (number) => void;
  className?: string;
}
export function IncreaseButton({ onDecrease, onIncrease, onChange, className }: PropsType) {
  const [amount, setAmount] = useState(1);
  const handleClick = (number) => {
    if (amount + number >= 1) {
      setAmount(amount + number);
    }
  };
  useEffect(() => {
    onChange(amount);
  }, [amount]);

  return (
    <div className={`flex items-center justify-center  text-primary ${className}`}>
      <i className={`text-2xl text-gray-500`} onClick={() => handleClick(-1)}>
        <VscDiffRemoved />
      </i>
      <p className={`text-lg px-3 text-gray-600`}>{amount}</p>
      <i className={`text-2xl text-primary`} onClick={() => handleClick(1)}>
        <VscDiffAdded />
      </i>
    </div>
  );
}
