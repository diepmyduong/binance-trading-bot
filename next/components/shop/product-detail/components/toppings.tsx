import { database } from "faker/locale/de";
import { useEffect, useState } from "react";
import { NumberPipe } from "../../../../lib/pipes/number";
import { ProductTopping, ToppingOption } from "../../../../lib/repo/product-topping.repo";

interface PropsType extends ReactProps {
  toppings?: ProductTopping[];
  topping?: ProductTopping;
  onChange?: any;
  onSelect?: any;
}
export function Toppings({ toppings, onChange }: PropsType) {
  let [data, setData] = useState<any>({});
  const handleClick = (dta, id) => {
    data[id] = dta;
    setData({ ...data });
    onChange(data);
  };

  return (
    <div className="">
      {toppings.map((topping, index) => {
        return (
          <Topping
            topping={topping}
            onSelect={(dta, id) => {
              handleClick(dta, id);
            }}
            key={index}
          />
        );
      })}
    </div>
  );
}

function Topping({ topping, onSelect }: PropsType) {
  const [data, setData] = useState<ToppingOption>();
  useEffect(() => {}, [data]);
  return (
    <div className="">
      <div className="bg-primary-light  px-4 py-2">
        <h2 className="font-bold text-sm">{topping.name}</h2>
        {topping.required && (
          <p className="text-xs text-danger">Bắt buộc chọn ít nhất {topping.min} món</p>
        )}
      </div>
      <div className="">
        {topping.options.map((item, index) => {
          return (
            <OneDish
              item={item}
              name={topping.name}
              key={index}
              onClick={() => {
                onSelect(item, topping.id);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

interface PropsOneDish {
  item: ToppingOption;
  onClick?: () => void;
  name?: string;
}
const OneDish = ({ item, onClick, name }: PropsOneDish) => {
  return (
    <div
      key={item.name}
      className="flex items-center justify-between px-4 border-b border-gray-300"
      onClick={() => {
        onClick();
      }}
    >
      <div className="flex items-center w-full">
        <input type="radio" id={item.name} name={name} className="inline form-checkbox py-1" />
        <label htmlFor={item.name} className="inline font-light text-sm ml-2 cursor-pointer w-full">
          {item.name}
        </label>
      </div>
      <div className="text-sm text-gray-400 min-w-max">{NumberPipe(item.price)} đ</div>
    </div>
  );
};
