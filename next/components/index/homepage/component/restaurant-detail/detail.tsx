import { HiOutlineX, HiStar } from "react-icons/hi";
import { NumberPipe } from "../../../../../lib/pipes/number";
import { IncreaseButton } from "../../../../shared/increase-button/increase-button";
import { Button } from "../../../../shared/utilities/form/button";
import { Label } from "../../../../shared/utilities/form/label";
import { Radio } from "../../../../shared/utilities/form/radio";
import { Img } from "../../../../shared/utilities/img";
import { useCartContext } from "../../../../../lib/providers/cart-provider";

interface PropsType extends ReactProps {
  item: {
    name: string;
    sold: number | string;
    des: string;
    price: number;
    img: string;
    rating?: number | string;
  };
  handleChange: () => void;
  onClose: () => void;
}
export function RestaurantDetail({ item, handleChange, onClose }: PropsType) {
  const { cart } = useCartContext();

  return (
    <div className="w-full h-full relative rounded">
      <div
        className="w-8 h-8 absolute top-2 right-2 z-200 bg-white rounded-full flex items-center justify-center"
        onClick={() => onClose()}
      >
        <i className=" text-2xl text-gray-600 ">
          <HiOutlineX />
        </i>
      </div>
      <Img src={"https://i.imgur.com/a8BAycP.png"} className="w-full" ratio169 />
      <div className="sticky overflow-auto h-full">
        <h2 className="px-4 pt-4 text-xl">{item.name}</h2>
        <div className="px-4 text-xs text-gray-600 py-1 flex items-center space-x-1">
          <i className="text-accent">
            <HiStar />
          </i>
          <div className="font-bold">{"4.6"}</div>
          <div className="px-2">-</div>
          <div className="">{`Đã bán ${item.sold}`}</div>
        </div>
        <p className="px-4 text-xs text-gray-300">{item.des}</p>
        <Button text="+ Lời nhắn cho cửa hàng" textPrimary className="py-2 text-xs" unfocusable />
        <div className="bg-primary-light  px-4 py-2">
          <h2 className="font-bold text-sm">Các món ăn kèm</h2>
          <p className="pt-1 text-xs">Chọn ít nhất 1 món</p>
        </div>
        <div className="">
          {data.sideDishes.map((item) => {
            return (
              <div className="flex items-center justify-between px-4 py-1 border-b border-gray-300">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id={item.dish}
                    name="sideDishes"
                    className="inline form-checkbox"
                  />
                  <label htmlFor={item.dish} className="inline font-light text-sm ml-2">
                    {item.dish}
                  </label>
                </div>
                <div className="text-sm text-gray-400">{NumberPipe(item.price)}đ</div>
              </div>
            );
          })}
        </div>
        <div className="bg-primary-light px-4 py-2">
          <h2 className="font-bold text-sm">
            Các đi kèm <span className="text-red-600">*</span>
          </h2>
          <p className="pt-1 text-xs text-red-600">Bắt buộc Chọn ít nhất 1 món</p>
        </div>
        <div className="">
          {data.obligatoryDishes.map((item) => {
            return (
              <div className="flex items-center justify-between px-4 py-1 border-b border-gray-300">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id={item.dish}
                    name="obligatoryDishes"
                    className="inline form-checkbox"
                  />
                  <label htmlFor={item.dish} className="inline font-light text-sm ml-2">
                    {item.dish}
                  </label>
                </div>
                <div className="text-sm text-gray-400">{NumberPipe(item.price)}đ</div>
              </div>
            );
          })}
        </div>
        <div className="relative bg-white bottom-0 w-full px-4 my-2 flex items-center space-x-7">
          <IncreaseButton />
          <Button
            primary
            text={`Thêm ${NumberPipe(item.price)}`}
            className="w-full"
            onClick={() => {
              handleChange();
            }}
          />
        </div>
      </div>
    </div>
  );
}
const data = {
  sideDishes: [
    {
      dish: "Trứng chiên",
      price: 13000,
    },
    {
      dish: "Trứng hấp",
      price: 13000,
    },
    {
      dish: "Trứng luộc",
      price: 12000,
    },
  ],
  obligatoryDishes: [
    {
      dish: "Rau",
      price: 0,
    },
    {
      dish: "Canh",
      price: 0,
    },
  ],
};
