import { HiOutlineX, HiStar } from "react-icons/hi";
import { NumberPipe } from "../../../../../lib/pipes/number";
import { IncreaseButton } from "../../../../shared/increase-button/increase-button";
import { Button } from "../../../../shared/utilities/form/button";
import { Label } from "../../../../shared/utilities/form/label";
import { Radio } from "../../../../shared/utilities/form/radio";
import { Img } from "../../../../shared/utilities/img";
import { useCartContext } from "../../../../../lib/providers/cart-provider";
import { useEffect, useRef, useState } from "react";
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
    basePrice?: number;
  };
  onClose: () => void;
}
export function RestaurantDetail({ item, onClose }: PropsType) {
  console.log("item", item);
  const { cartProducts, addProductToCart } = useCartContext();
  const [openDialog, setOpenDialog] = useState(false);
  const [count, setCount] = useState(1);
  const [opacity, setOpacity] = useState("opacity-0");
  const ref = useRef(null);
  const [intervalScroll, setIntervalScroll] = useState(0);

  function dialogScrollEvent() {
    let scrollCheckInterval = null;
    scrollCheckInterval = setInterval(() => {
      if (ref.current) {
        let temp = parseInt(((ref.current.scrollTop / 215) * 10).toFixed(0)) * 10;
        if (temp > 100) setOpacity("opacity-100");
        else setOpacity("opacity-" + temp);
      }
    }, 300);
    setIntervalScroll(scrollCheckInterval);
  }
  useEffect(() => {
    window.addEventListener("scroll", dialogScrollEvent);

    return () => {
      clearInterval(intervalScroll);
    };
  }, []);
  return (
    <div ref={ref} className="w-full h-screen rounded bg-white overflow-y-auto">
      <div className="relative w-full">
        <div
          className={`w-8 h-8 absolute right-2 top-2 z-200 rounded-full flex items-center justify-center cursor-pointer${
            opacity == "opacity-100" ? "invisible" : "visible"
          }`}
          onClick={() => onClose()}
        >
          <i className="text-2xl text-gray-600 ">
            <HiOutlineX />
          </i>
        </div>
      </div>
      <div
        className={`z-50 w-full ${opacity} fixed top-0 h-12 flex items-center justify-center max-w-lg bg-white `}
      >
        <h2 className="text-xl text-center w-full flex-1">{item.name}</h2>
        <div
          className={`w-8 h-8 mr-2 z-200 rounded-full bg-gray-50 flex items-center justify-center cursor-pointer ${
            opacity == "opacity-100" ? "visible" : "invisible"
          }`}
          onClick={() => onClose()}
        >
          <i className="text-2xl text-gray-600">
            <HiOutlineX />
          </i>
        </div>
      </div>
      <div className="w-full sticky top-0">
        <Img src={item.img} className="w-full" ratio169 />
      </div>

      <div ref={ref} className="sticky overflow-auto bg-white">
        <h2 className="header-name px-4 pt-4 text-xl">{item.name}</h2>
        <div className="px-4 text-xs text-gray-600 py-1 flex items-center space-x-1">
          <i className="text-accent">
            <HiStar />
          </i>
          <div className="font-bold">{"4.6"}</div>
          <div className="px-2">-</div>
          <div className="">{`Đã bán ${item.sold || 0}`}</div>
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
            return <OneDish item={item} />;
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
            return <OneDish item={item} />;
          })}
        </div>
      </div>
      <div className="h-22"></div>
      <div className="fixed shadow-2xl bg-white -bottom-0 max-w-lg w-full px-4 py-4 flex items-center space-x-7">
        <IncreaseButton onChange={(count) => setCount(count)} />
        <Button
          primary
          text={`Thêm ${NumberPipe(item.basePrice * count)} đ`}
          className="w-full"
          onClick={() => {
            addProductToCart(item, 1);
            onClose();
          }}
        />
      </div>
      <Form
        dialog
        slideFromBottom="none"
        mobileSizeMode
        isOpen={openDialog}
        onClose={() => setOpenDialog(false)}
        onSubmit={() => {
          setOpenDialog(false);
        }}
        className="px-4 py-4"
      >
        <Field label="Lời nhắn của khách hàng" name="note">
          <Textarea placeholder="Nhập Lời nhắn của khách hàng" />
        </Field>
        <SaveButtonGroup cancelText="" />
      </Form>
    </div>
  );
}

const OneDish = ({ item }) => {
  return (
    <div className="flex items-center justify-between px-4 py-1 border-b border-gray-300">
      <div className="flex items-center w-full">
        <input
          type="radio"
          id={item.dish}
          name="obligatoryDishes"
          className="inline form-checkbox"
        />
        <label htmlFor={item.dish} className="inline font-light text-sm ml-2 cursor-pointer w-full">
          {item.dish}
        </label>
      </div>
      <div className="text-sm text-gray-400 min-w-max">{NumberPipe(item.price)} đ</div>
    </div>
  );
};
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
