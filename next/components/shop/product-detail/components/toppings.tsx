import { database } from "faker/locale/de";
import { useEffect, useState } from "react";
import { NumberPipe } from "../../../../lib/pipes/number";
import { ProductTopping, ToppingOption } from "../../../../lib/repo/product-topping.repo";
import { useProductDetailContext } from "../provider/product-detail-provider";

interface PropsType extends ReactProps {
  toppings?: ProductTopping[];
  topping?: ProductTopping;
  onChange?: any;
  onSelected?: any;
  listSelected?: any;
}
export function Toppings({ toppings }: PropsType) {
  const { dataTopping, setDataTopping, productDetail } = useProductDetailContext();
  const handleClick = (item: ToppingOption, toppingId: string, toppingName: string) => {
    let temp = {
      toppingName: toppingName,
      toppingId: toppingId,
      optionName: item.name,
      price: item.price,
    };
    dataTopping[toppingId] = temp;
    setDataTopping({ ...dataTopping });
    console.log("Toppings", dataTopping);
  };
  useEffect(() => {
    if (productDetail)
      productDetail.toppings.forEach((item) => {
        if (item.required) handleClick(item.options[0], item.id, item.name);
      });
  }, [productDetail]);
  return (
    <div className="">
      {toppings.map((topping, index) => {
        return (
          <Topping
            topping={topping}
            onSelected={(item) => {
              handleClick(item, topping.id, topping.name);
            }}
            key={index}
          />
        );
      })}
    </div>
  );
}

function Topping({ topping, onSelected }: PropsType) {
  const [data, setData] = useState<ToppingOption>();
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
              toppingId={topping.id}
              key={index}
              onClick={() => {
                onSelected(item);
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
  toppingId?: string;
  listSelected?: any;
}
const OneDish = ({ item, onClick, toppingId }: PropsOneDish) => {
  const [checked, setchecked] = useState(false);
  const { dataTopping } = useProductDetailContext();
  useEffect(() => {
    if (dataTopping[toppingId])
      if (dataTopping[toppingId].optionName == item.name) setchecked(true);
      else setchecked(false);
  }, [dataTopping]);
  return (
    <div
      key={item.name}
      className="flex items-center justify-between px-4 border-b border-gray-300"
      onClick={() => {
        onClick();
      }}
    >
      <div className="flex items-center w-full">
        <input
          type="radio"
          id={item.name}
          name={toppingId}
          className="inline form-checkbox py-1"
          defaultChecked={checked}
        />
        <label htmlFor={item.name} className="inline font-light text-sm ml-2 cursor-pointer w-full">
          {item.name}
        </label>
      </div>
      <div className="text-sm text-gray-400 min-w-max">{NumberPipe(item.price)} đ</div>
    </div>
  );
};
