import React from "react";
import { Food } from "../../../../../lib/providers/cart-provider";
import { Dialog, DialogPropsType } from "../../../../shared/utilities/dialog/dialog";
import ListCart from "./list-cart";
import { Button } from "../../../../shared/utilities/form/button";
interface Propstype extends DialogPropsType {
  cart: Food[];
  onChange: Function;
  money?: number | string;
}

const CartDialog = (props: Propstype) => {
  return (
    <Dialog mobileMode isOpen={props.isOpen} onClose={props.onClose} title={"Giỏ hàng của bạn"}>
      <Dialog.Body>
        <ListCart cart={props.cart} onChange={props.onChange} />
      </Dialog.Body>
      <Dialog.Footer>
        <div className="w-full flex justify-end">
          <Button primary large text={`Thanh toán ${props.money}`} className="justify-end" />
        </div>
      </Dialog.Footer>
    </Dialog>
  );
};

export default CartDialog;
