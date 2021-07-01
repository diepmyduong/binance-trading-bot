import { useEffect, useState } from "react";
import { FaAsterisk } from "react-icons/fa";
import { RiCloseCircleLine, RiSearch2Line } from "react-icons/ri";
import { convertViToEn } from "../../../../lib/helpers/convert-vi-to-en";
import { NumberPipe } from "../../../../lib/pipes/number";
import { ProductTopping } from "../../../../lib/repo/product-topping.repo";
import { Input } from "../../../shared/utilities/form/input";
import { NotFound } from "../../../shared/utilities/not-found";
import { Spinner } from "../../../shared/utilities/spinner";
import { useProductsContext } from "../providers/products-provider";

interface PropsType extends ReactProps {
  onToppingSelect: (topping: ProductTopping) => any;
}
export function ToppingSelection({ onToppingSelect }: PropsType) {
  const [searchText, setSearchText] = useState("");
  const { toppings, loadToppings } = useProductsContext();
  const [filteredToppings, setFilteredToppings] = useState<ProductTopping[]>();

  useEffect(() => {
    if (toppings) {
      setFilteredToppings(
        toppings.filter((topping) => {
          if (searchText) {
            return convertViToEn(topping.name).includes(convertViToEn(searchText));
          } else {
            return true;
          }
        })
      );
    }
  }, [toppings, searchText]);

  useEffect(() => {
    loadToppings();
  }, []);

  if (!toppings) return <Spinner />;
  return (
    <div style={{ width: "450px", marginLeft: "-9px", marginRight: "-9px" }}>
      <Input
        className="border-0 no-focus"
        placeholder="Tìm kiếm topping"
        prefix={<RiSearch2Line />}
        clearable
        value={searchText}
        onChange={setSearchText}
      />
      <div className="p-4 border-t border-gray-200 v-scrollbar" style={{ maxHeight: "550px" }}>
        {!filteredToppings?.length && (
          <NotFound icon={<RiCloseCircleLine />} text="Không có mẫu topping nào" />
        )}
        {filteredToppings?.map((topping) => (
          <div
            className={`border border-gray-300 hover:border-primary hover:bg-primary-light transition-colors duration-150 shadow-sm rounded mb-2 p-3 cursor-pointer`}
            key={topping.id}
            onClick={() => onToppingSelect(topping)}
          >
            <div className="font-semibold text-gray-800 flex">
              {topping.name}
              {topping.required && (
                <i className="text-danger text-xs ml-1 mt-0.5">
                  <FaAsterisk />
                </i>
              )}
            </div>
            <div className="text-gray-600">
              {topping.options
                .map((option) => `${option.name} ${NumberPipe(option.price, true)}`)
                .join(", ")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
