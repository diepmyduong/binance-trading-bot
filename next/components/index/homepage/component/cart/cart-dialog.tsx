import React from "react";
import { Food } from "../../../../../lib/providers/cart-provider";
import { Dialog, DialogPropsType } from "../../../../shared/utilities/dialog/dialog";
import ListCart from "./list-cart";
import { Button } from "../../../../shared/utilities/form/button";
import { NumberPipe } from "../../../../../lib/pipes/number";
interface Propstype extends DialogPropsType {
  cart: Food[];
  onChange: Function;
  money?: number | string;
}

const CartDialog = (props: Propstype) => {
  return (
    <Dialog
      mobileMode
      isOpen={props.isOpen}
      onClose={props.onClose}
      title={"Giỏ hàng của bạn"}
      width="320px"
    >
      <Dialog.Body>
        <ListCart cart={props.cart} onChange={props.onChange} />
      </Dialog.Body>
      <Dialog.Footer>
        <Button
          primary
          large
          text={`Thanh toán ${NumberPipe(props.money, true)}`}
          className="w-full"
        />
      </Dialog.Footer>
    </Dialog>
  );
};

export default CartDialog;
