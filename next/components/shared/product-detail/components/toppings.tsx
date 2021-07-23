import { database } from "faker/locale/de";
import { useEffect, useState } from "react";
import { RiCheckboxBlankCircleLine, RiRadioButtonLine } from "react-icons/ri";
import { NumberPipe } from "../../../../lib/pipes/number";
import { ProductTopping, ToppingOption } from "../../../../lib/repo/product-topping.repo";
import { Checkbox } from "../../utilities/form/checkbox";
import { useProductDetailContext } from "../provider/product-detail-provider";

export function Toppings() {
  const { product } = useProductDetailContext();
  // const handleClick = (item: ToppingOption, toppingId: string, toppingName: string) => {
  //   let temp = {
  //     toppingName: toppingName,
  //     toppingId: toppingId,
  //     optionName: item.name,
  //     price: item.price,
  //   };
  //   dataTopping[toppingId] = temp;
  //   setDataTopping({ ...dataTopping });
  //   console.log("Toppings", dataTopping);
  // };
  // useEffect(() => {
  //   if (product)
  //     product.toppings.forEach((item) => {
  //       if (item.required) handleClick(item.options[0], item.id, item.name);
  //     });
  // }, [product]);

  return (
    <div>
      {product?.toppings.map((topping, index) => (
        <Topping
          topping={topping}
          // onSelected={(item) => {
          //   handleClick(item, topping.id, topping.name);
          // }}
          key={topping.id}
        />
      ))}
    </div>
  );
}

interface ToppingProps extends ReactProps {
  topping: ProductTopping;
}
function Topping({ topping }: ToppingProps) {
  const { onToppingOptionClick } = useProductDetailContext();

  return (
    <>
      <div className="bg-primary-light border-t border-gray-300 px-4 py-2">
        <h2 className="font-bold text-sm">{topping.name}</h2>
        {topping.required && (
          <div className="text-xs text-danger">Bắt buộc chọn ít nhất {topping.min} món</div>
        )}
      </div>
      {topping.options.map((option, index) => {
        return (
          <ProductToppingOption
            option={option}
            key={index}
            onClick={() => {
              onToppingOptionClick(option, topping);
            }}
          />
        );
      })}
    </>
  );
}

interface ToppingOptionProps {
  option: ToppingOption;
  onClick?: () => void;
}
const ProductToppingOption = ({ option, onClick }: ToppingOptionProps) => {
  // const [checked, setchecked] = useState(false);
  // const { dataTopping } = useProductDetailContext();
  // useEffect(() => {
  //   if (dataTopping[toppingId])
  //     if (dataTopping[toppingId].optionName == option.name) setchecked(true);
  //     else setchecked(false);
  // }, [dataTopping]);
  return (
    <div
      key={option.name}
      className="flex items-center justify-between px-4 py-1 border-t border-gray-100 cursor-pointer hover:bg-gray-50"
      onClick={onClick}
    >
      {/* <div className="flex items-center w-full">
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
      </div> */}
      <Checkbox
        value={option.selected}
        className="pointer-events-none"
        checkedIcon={<RiRadioButtonLine />}
        uncheckedIcon={<RiCheckboxBlankCircleLine />}
        placeholder={option.name}
      />
      <div className="text-gray-600 min-w-max">{NumberPipe(option.price)} đ</div>
    </div>
  );
};
