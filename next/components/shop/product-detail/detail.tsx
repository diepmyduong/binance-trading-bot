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
import { OrderItemToppingInput, ToppingOption } from "../../../lib/repo/product-topping.repo";
import { notEqual } from "assert";
import { FaPen } from "react-icons/fa";
import { Toppings } from "./components/toppings";

interface PropsType extends DialogPropsType {
  productId?: any;
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
  const [count, setCount] = useState(1);
  const [toppings, setToppings] = useState([]);
  const [opacity, setOpacity] = useState<number>();
  const ref = useRef(null);
  const [intervalScroll, setIntervalScroll] = useState(0);
  const [topping, setTopping] = useState<OrderItemToppingInput[]>([]);
  const [totalMoney, setTotalMoney] = useState(0);
  const { productDetail } = useProductDetailContext();

  useEffect(() => {
    let total = 0;
    if (productDetail) {
      topping.forEach((item) => (total += item.price));
      total += productDetail.downPrice * count;
      setTotalMoney(total);
    }
  }, [count, topping]);

  useEffect(() => {
    setTopping([]);
    setCount(1);
    if (productDetail) setTotalMoney(productDetail.downPrice * count);
  }, [productDetail]);

  function handleAddTopping(data) {
    let arr: OrderItemToppingInput[] = [];
    for (var item in data) {
      let temp: OrderItemToppingInput = {
        toppingName: data[item].nameTopping,
        toppingId: item,
        optionName: data[item].name,
        price: data[item].price,
      };
      arr.push({ ...temp });
    }
    setTopping([...arr]);
  }

  function dialogScrollEvent() {
    let scrollCheckInterval = null;
    scrollCheckInterval = setInterval(() => {
      if (ref.current) {
        let temp = parseInt(((ref.current.scrollTop / 200) * 10).toFixed(0)) * 10;
        if (temp > 100) setOpacity(100);
        else setOpacity(temp);
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

  if (!productDetail) return <div className=""></div>;
  return (
    <Dialog
      isOpen={props.isOpen}
      onClose={props.onClose}
      mobileSizeMode
      slideFromBottom="all"
      bodyClass="relative rounded w-full"
    >
      <div ref={ref} className="w-full rounded bg-white overflow-y-auto" style={{ height: "95vh" }}>
        <div
          className={`w-8 h-8 absolute right-2 top-2 z-200 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer ${
            opacity == 100 ? "invisible" : "visible"
          }`}
          onClick={props.onClose}
        >
          <i className="text-2xl text-gray-600 ">
            <HiOutlineX />
          </i>
        </div>
        <div
          className={`z-50 w-full opacity-${
            opacity >= 90 ? opacity : 0
          } fixed top-0 h-12 max-w-lg bg-white `}
        >
          <h2
            className={`text-xl text-center w-full pt-2 ${
              opacity == 100 ? "visible" : "invisible"
            } `}
          >
            {productDetail.name}
          </h2>
          <div
            className={`absolute top-2 right-2 w-8 h-8 z-200 rounded-full bg-gray-50 flex items-center justify-center cursor-pointer ${
              opacity == 100 ? "visible" : "invisible"
            }`}
            onClick={props.onClose}
          >
            <i className="text-2xl text-gray-600">
              <HiOutlineX />
            </i>
          </div>
        </div>
        <div className="relative w-full top-0 ">
          <Img src={productDetail.image} ratio169 />
          <div className="absolute bottom-0 left-0 w-full h-1/3  px-4 text-xs text-white py-1 flex items-end space-x-1 bg-opacity-20 bg-gradient-to-t from-primary">
            <div className="flex items-center">
              <i className="text-yellow-500 px-1">
                <HiStar />
              </i>
              <div className="font-semibold">{productDetail.rating}</div>
              <div className="px-1">-</div>
              <div className="">{`Đã bán ${productDetail.soldQty || 0}`}</div>
            </div>
          </div>
        </div>

        <div ref={ref} className="sticky overflow-auto bg-white">
          <h2 className="header-name px-4 pt-4 text-xl">{productDetail.name}</h2>
          <div className="px-4 text-gray-700 py-1 flex items-center space-x-1">
            <div className="font-bold">{NumberPipe(productDetail.downPrice)}đ</div>
            <div className="text-xs line-through px-1">{NumberPipe(productDetail.basePrice)}đ</div>
            {productDetail.saleRate && (
              <div className="bg-red-500 text-white text-xs rounded px-2">
                {productDetail.saleRate || 0}%
              </div>
            )}
          </div>
          <p className="px-4 text-sm text-gray-500">{productDetail.subtitle}</p>
          <Note />
          <div className="">
            <Toppings
              toppings={productDetail.toppings}
              onChange={(dta) => {
                handleAddTopping(dta);
              }}
            />
          </div>
        </div>
        <div className="h-22"></div>
        <Dialog.Footer>
          <div className="fixed shadow-2xl bg-white -bottom-0 max-w-lg w-full px-4 py-4 flex items-center space-x-7">
            <IncreaseButton onChange={(count) => setCount(count)} />
            <Button
              primary
              text={`Thêm ${NumberPipe(totalMoney)} đ`}
              className="w-full"
              onClick={() => {
                addProductToCart(productDetail, count, topping);
                props.onClose();
              }}
              small
            />
          </div>
        </Dialog.Footer>
      </div>
    </Dialog>
  );
}

const Note = () => {
  const [note, setNote] = useState({ note: "" });
  const [openDialog, setOpenDialog] = useState(false);
  return (
    <div className="">
      <div className="mt-1 text-xs">
        {note.note != "" ? (
          <div className="px-4 py-2 bg-white w-full">
            <div className="flex items-center justify-between">
              <p className="font-bold">Lời nhắn cho cửa hàng</p>
              <i className="hover:text-primary cursor-pointer" onClick={() => setOpenDialog(true)}>
                <FaPen />
              </i>
            </div>
            <p className="">{note.note}</p>
          </div>
        ) : (
          <Button
            text="+ Lời nhắn cho cửa hàng"
            textPrimary
            className="py-2 text-xs"
            unfocusable
            onClick={() => setOpenDialog(true)}
          />
        )}
      </div>
      <Form
        dialog
        slideFromBottom="mobile-only"
        mobileSizeMode
        isOpen={openDialog}
        onClose={() => setOpenDialog(false)}
        initialData={note}
        onSubmit={(data) => {
          setNote({ ...data });
          setOpenDialog(false);
        }}
        className=""
      >
        <Field label="Lời nhắn của khách hàng" name="note">
          <Textarea placeholder="Nhập Lời nhắn của khách hàng" />
        </Field>
        <SaveButtonGroup cancelText="" />
      </Form>
    </div>
  );
};
