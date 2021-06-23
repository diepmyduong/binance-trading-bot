import { HiOutlineX, HiStar } from "react-icons/hi";
import { NumberPipe } from "../../../../../lib/pipes/number";
import { IncreaseButton } from "../../../../shared/increase-button/increase-button";
import { Button } from "../../../../shared/utilities/form/button";
import { Label } from "../../../../shared/utilities/form/label";
import { Radio } from "../../../../shared/utilities/form/radio";
import { Img } from "../../../../shared/utilities/img";
import { useCartContext } from "../../../../../lib/providers/cart-provider";
import { useEffect, useState } from "react";
import { Form } from "../../../../shared/utilities/form/form";
import { Field } from "../../../../shared/utilities/form/field";
import { Textarea } from "../../../../shared/utilities/form/textarea";
import { SaveButtonGroup } from "../../../../shared/utilities/save-button-group";

interface PropsType extends ReactProps {
  item: {
    name: string;
    sold: number | string;
    des: string;
    price: number;
    img: string;
    rating?: number | string;
  };
  onClose: () => void;
}
export function RestaurantDetail({ item, onClose }: PropsType) {
  const { cart, handleChange } = useCartContext();
  const [openDialog, setOpenDialog] = useState(false);
  const [count, setCount] = useState(1);

  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom / 2 <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  function dialogScrollEvent() {
    let scrollCheckInterval = null;
    let dialog = document.getElementsByClassName("form-dialog");
    console.log("form-dialog", dialog);
  }
  useEffect(() => {
    document.addEventListener("scroll", dialogScrollEvent);
    return () => {
      document.removeEventListener("scroll", dialogScrollEvent);
    };
  }, []);
  return (
    <div className="w-full h-full rounded bg-white form-dialog">
      <div
        className="w-8 h-8 absolute top-2 right-2 z-200 bg-white rounded-full flex items-center justify-center cursor-pointer"
        onClick={() => onClose()}
      >
        <i className=" text-2xl text-gray-600 ">
          <HiOutlineX />
        </i>
      </div>
      <Img src={item.img} className="w-full" ratio169 />
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
        <p className="px-4 text-sm text-gray-500">{item.des}</p>
        <Button
          text="+ Lời nhắn cho cửa hàng"
          textPrimary
          className="py-2 text-xs"
          unfocusable
          onClick={() => setOpenDialog(true)}
        />
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
                  <label
                    htmlFor={item.dish}
                    className="inline font-light text-sm ml-2 cursor-pointer"
                  >
                    {item.dish}
                  </label>
                </div>
                <div className="text-sm text-gray-500">{NumberPipe(item.price)} đ</div>
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
                  <label
                    htmlFor={item.dish}
                    className="inline font-light text-sm ml-2 cursor-pointer"
                  >
                    {item.dish}
                  </label>
                </div>
                <div className="text-sm text-gray-400">{NumberPipe(item.price)}đ</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="sticky shadow-2xl bg-white -bottom-0 w-full px-4 py-4 flex items-center space-x-7">
        <IncreaseButton onChange={(count) => setCount(count)} />
        <Button
          primary
          text={`Thêm ${NumberPipe(item.price * count)}`}
          className="w-full"
          onClick={() => {
            handleChange(-1, item);
            onClose();
          }}
        />
      </div>
      <Form
        dialog
        mobileMode
        isOpen={openDialog}
        onClose={() => setOpenDialog(false)}
        onSubmit={() => {
          setOpenDialog(false);
        }}
        className="px-4 pt-4"
      >
        <Field label="Lời nhắn của khác hàng" name="note">
          <Textarea placeholder="Nhập Lời nhắn của khác hàng" />
        </Field>
        <SaveButtonGroup disableCancle />
      </Form>
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
