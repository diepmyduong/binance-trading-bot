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
    <div className={`flex items-center justify-center  text-primary font-semibold ${className}`}>
      <i
        className={`text-40 sm:text-48 text-gray-700 cursor-pointer font-semibold`}
        onClick={() => handleClick(-1)}
      >
        <VscDiffRemoved />
      </i>
      <p className={`text-xl font-semibold px-3 text-gray-700`}>{amount}</p>
      <i
        className={`text-40 sm:text-48 text-primary cursor-pointer font-semibold`}
        onClick={() => handleClick(1)}
      >
        <VscDiffAdded />
      </i>
    </div>
  );
}
