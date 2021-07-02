import { HiOutlineX, HiStar } from "react-icons/hi";
import { NumberPipe } from "../../../lib/pipes/number";
import { IncreaseButton } from "../../shared/increase-button/increase-button";
import { Button } from "../../shared/utilities/form/button";
import { Img } from "../../shared/utilities/img";
import { useCartContext } from "../../../lib/providers/cart-provider";
import { useEffect, useRef, useState } from "react";
import { Form } from "../../shared/utilities/form/form";
import { Field } from "../../shared/utilities/form/field";
import { Textarea } from "../../shared/utilities/form/textarea";
import { SaveButtonGroup } from "../../shared/utilities/save-button-group";
import { Dialog, DialogPropsType } from "../../shared/utilities/dialog/dialog";
import { Spinner } from "../../shared/utilities/spinner";
import { useProductsContext } from "../../admin/products/providers/products-provider";
import { useProductDetailContext } from "./provider/product-detail-provider";
import { ToppingOption } from "../../../lib/repo/product-topping.repo";

interface PropsType extends DialogPropsType {
  productId?: string;
  item?: {
    name: string;
    sold: number | string;
    des: string;
    price: number;
    img: string;
    rating?: number | string;
    basePrice?: number;
  };
}
export function ProductDetail({ item, productId, ...props }: PropsType) {
  const { cartProducts, addProductToCart } = useCartContext();
  const [openDialog, setOpenDialog] = useState(false);
  const [count, setCount] = useState(1);
  const [opacity, setOpacity] = useState("opacity-0");
  const ref = useRef(null);
  const [intervalScroll, setIntervalScroll] = useState(0);

  const { productDetail } = useProductDetailContext();
  function dialogScrollEvent() {
    let scrollCheckInterval = null;
    scrollCheckInterval = setInterval(() => {
      if (ref.current) {
        console.log(ref.current.scrollTop);
        let temp = parseInt(((ref.current.scrollTop / 215) * 10).toFixed(0)) * 10;
        if (temp > 100) setOpacity("opacity-100");
        else setOpacity("opacity-" + temp);
      }
    }, 300);
    setIntervalScroll(scrollCheckInterval);
  }
  useEffect(() => {
    // window.addEventListener("scroll", dialogScrollEvent);
    return () => {
      clearInterval(intervalScroll);
    };
  }, []);
  if (!productDetail) return <div className=""></div>;
  return (
    <Dialog
      isOpen={props.isOpen}
      onClose={props.onClose}
      mobileSizeMode
      slideFromBottom="all"
      bodyClass="relative rounded"
    >
      <div ref={ref} className="w-full h-full rounded bg-white overflow-y-auto">
        <div className="relative w-full">
          <div
            className={`w-8 h-8 absolute right-2 top-2 z-200 rounded-full flex items-center justify-center cursor-pointer${
              opacity == "opacity-100" ? "invisible" : "visible"
            }`}
            onClick={props.onClose}
          >
            <i className="text-2xl text-gray-600 ">
              <HiOutlineX />
            </i>
          </div>
        </div>
        <div
          className={`z-50 w-full ${opacity} fixed top-0 h-12 flex items-center justify-center max-w-lg bg-white `}
        >
          <h2 className="text-xl text-center w-full flex-1">{productDetail.name}</h2>
          <div
            className={`w-8 h-8 mr-2 z-200 rounded-full bg-gray-50 flex items-center justify-center cursor-pointer ${
              opacity == "opacity-100" ? "visible" : "invisible"
            }`}
            onClick={props.onClose}
          >
            <i className="text-2xl text-gray-600">
              <HiOutlineX />
            </i>
          </div>
        </div>
        <div className="w-full h-full top-0">
          <Img src={productDetail.image} ratio169 />
        </div>

        <div ref={ref} className="sticky overflow-auto bg-white">
          <h2 className="header-name px-4 pt-4 text-xl">{productDetail.name}</h2>
          <div className="px-4 text-xs text-gray-600 py-1 flex items-center space-x-1">
            <i className="text-accent">
              <HiStar />
            </i>
            <div className="font-bold">{productDetail.rating}</div>
            <div className="px-2">-</div>
            <div className="">{`Đã bán ${productDetail.soldQty || 0}`}</div>
          </div>
          <p className="px-4 text-sm text-gray-500">{productDetail.subtitle}</p>
          <Button
            text="+ Lời nhắn cho cửa hàng"
            textPrimary
            className="py-2 text-xs"
            unfocusable
            onClick={() => setOpenDialog(true)}
          />
          <div className="">
            {productDetail.toppings &&
              productDetail.toppings.map((item, index) => {
                if (item.options.length > 0)
                  return (
                    <div className="">
                      <div className="bg-primary-light  px-4 py-2">
                        <h2 className="font-bold text-sm">{item.name}</h2>
                        <p className="pt-1 text-xs"></p>
                      </div>
                      <div className="">
                        {item.options.map((item, index) => {
                          return <OneDish item={item} key={index} />;
                        })}
                      </div>
                    </div>
                  );
              })}
          </div>
        </div>
        <div className="h-22"></div>
        <Dialog.Footer>
          <div className="fixed shadow-2xl bg-white -bottom-0 max-w-lg w-full px-4 py-4 flex items-center space-x-7">
            <IncreaseButton onChange={(count) => setCount(count)} />
            <Button
              primary
              text={`Thêm ${NumberPipe(productDetail.basePrice * count)} đ`}
              className="w-full"
              onClick={() => {
                addProductToCart(productDetail, count);
                props.onClose();
              }}
            />
          </div>
        </Dialog.Footer>
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
    </Dialog>
  );
}

interface PropsOneDish {
  item: ToppingOption;
}
const OneDish = ({ item }: PropsOneDish) => {
  return (
    <div className="flex items-center justify-between px-4 py-1 border-b border-gray-300">
      <div className="flex items-center w-full">
        <input
          type="radio"
          id={item.name}
          name="obligatoryDishes"
          className="inline form-checkbox"
        />
        <label htmlFor={item.name} className="inline font-light text-sm ml-2 cursor-pointer w-full">
          {item.name}
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
