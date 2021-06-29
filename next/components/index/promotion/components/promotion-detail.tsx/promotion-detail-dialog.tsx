import React, { useState } from "react";
import { Food } from "../../../../../lib/providers/cart-provider";
import { Dialog, DialogPropsType } from "../../../../shared/utilities/dialog/dialog";
import { Button } from "../../../../shared/utilities/form/button";
import { NumberPipe } from "../../../../../lib/pipes/number";
import CustomerLoginDialog from "../../../../shared/utilities/dialog/customer-login-dialog";
import { useShopContext } from "../../../../../lib/providers/shop-provider";
import { useRouter } from "next/router";
interface Propstype extends DialogPropsType {
  cart: Food[];
  onChange: Function;
  money?: number | string;
}

const CartDialog = (props: Propstype) => {
  const router = useRouter();
  return (
    <Dialog
      isOpen={props.isOpen}
      onClose={props.onClose}
      title={"Mã khuyến mãi"}
      mobileSizeMode
      slideFromBottom="all"
    >
      <Dialog.Body></Dialog.Body>
      <Dialog.Footer>
        <Button
          primary
          large
          text={`Thanh toán ${NumberPipe(props.money, true)}`}
          className="w-full"
          onClick={() => {}}
        />
      </Dialog.Footer>
    </Dialog>
  );
};

export default CartDialog;
