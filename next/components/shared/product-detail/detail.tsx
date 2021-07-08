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
import { useProductDetailContext } from "./provider/product-detail-provider";
import { FaPen } from "react-icons/fa";
import { Toppings } from "./components/toppings";
import { Spinner } from "../utilities/spinner";

interface PropsType extends DialogPropsType {}
export function ProductDetail({ ...props }: PropsType) {
  const { addProductToCart } = useCartContext();
  const [opacity, setOpacity] = useState<number>(0);
  const ref = useRef(null);
  const { product, totalMoney, qty, toppings, onChangeQuantity } = useProductDetailContext();

  const checkScrollTop = (scrollTop) => {
    let temp = scrollTop / 50;
    setOpacity(temp > 1 ? 1 : temp);
  };

  useEffect(() => {
    checkScrollTop(0);
  }, []);

  return (
    <Dialog
      isOpen={props.isOpen}
      onClose={props.onClose}
      mobileSizeMode
      slideFromBottom="all"
      extraFooterClass="border-t border-gray-300"
    >
      {!product ? (
        <Spinner />
      ) : (
        <>
          <div
            ref={ref}
            className="v-scrollbar"
            style={{ height: "calc(96vh - 95px)" }}
            onScroll={(e) => checkScrollTop(e.currentTarget.scrollTop)}
          >
            <div
              className={`w-8 h-8 absolute right-2 top-2 z-200 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer`}
              onClick={props.onClose}
            >
              <i className="text-2xl text-gray-600 ">
                <HiOutlineX />
              </i>
            </div>
            <div
              className={`z-50 w-full absolute top-0 h-12 max-w-lg bg-white `}
              style={{ opacity }}
            >
              <h2 className={`text-xl text-center w-full pt-2`}>{product.name}</h2>
              <div
                className={`absolute top-2 right-2 w-8 h-8 z-200 rounded-full bg-gray-50 flex items-center justify-center cursor-pointer`}
                onClick={props.onClose}
              >
                <i className="text-2xl text-gray-600">
                  <HiOutlineX />
                </i>
              </div>
            </div>
            <div className="relative w-full top-0 ">
              <Img src={product.image} ratio169 />
              <div className="absolute bottom-0 left-0 w-full h-12 p-3 text-xs text-white flex items-end bg-opacity-20 bg-gradient-to-t from-primary">
                <div className="flex items-center">
                  <i className="text-yellow-500 px-1">
                    <HiStar />
                  </i>
                  <div className="font-semibold">{product.rating}</div>
                  <div className="px-1">-</div>
                  <div className="">{`Đã bán ${product.soldQty || 0}`}</div>
                </div>
              </div>
            </div>

            <div ref={ref} className="bg-white mb-22">
              <h2 className="header-name px-4 pt-4 text-xl">{product.name}</h2>
              <div className="px-4 text-gray-700 py-1 flex items-center space-x-1">
                <div className="font-bold text-danger">{NumberPipe(product.basePrice)}đ</div>
                <div className="text-xs line-through px-1">{NumberPipe(product.downPrice)}đ</div>
                {product.saleRate && (
                  <div className="bg-red-500 text-white text-xs rounded px-2">
                    {product.saleRate || 0}%
                  </div>
                )}
              </div>
              <p className="px-4 text-sm text-gray-500">{product.subtitle}</p>
              <Note />
              <Toppings />
            </div>
          </div>
        </>
      )}
      <Dialog.Footer>
        {/* <div className="fixed shadow-2xl bg-white -bottom-0 max-w-lg w-full px-4 py-4 flex items-center space-x-7"> */}
        <IncreaseButton onChange={onChangeQuantity} />
        <Button
          primary
          text={`Thêm ${NumberPipe(totalMoney)} đ`}
          className="w-full bg-gradient h-12 ml-2"
          large
          onClick={() => {
            addProductToCart(product, qty);
            props.onClose();
          }}
        />
        {/* </div> */}
      </Dialog.Footer>
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
            <p className="text-gray-700">{note.note}</p>
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
