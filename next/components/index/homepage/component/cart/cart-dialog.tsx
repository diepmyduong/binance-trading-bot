import React, { useState } from "react";
import { Food } from "../../../../../lib/providers/cart-provider";
import { Dialog, DialogPropsType } from "../../../../shared/utilities/dialog/dialog";
import ListCart from "./list-cart";
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
  const { customer, cunstomerLogin } = useShopContext();
  const [showLogin, setShowLogin] = useState(false);
  return (
    <Dialog
      isOpen={props.isOpen}
      onClose={props.onClose}
      title={"Giỏ hàng của bạn"}
      mobileSizeMode
      bodyClass="relative bg-white rounded"
      slideFromBottom="all"
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
          onClick={() => {
            if (customer) {
              router.push("/payment");
            } else {
              setShowLogin(true);
            }
          }}
        />
      </Dialog.Footer>
      <CustomerLoginDialog
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onConfirm={(val) => {
          if (val) {
            cunstomerLogin(val);
            router.push("/payment");
          }
        }}
      />
    </Dialog>
  );
};

export default CartDialog;
