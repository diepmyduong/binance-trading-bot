import React, { useState } from "react";
import { CartProduct } from "../../../../lib/providers/cart-provider";
import { Dialog, DialogPropsType } from "../../../shared/utilities/dialog/dialog";
import { Button } from "../../../shared/utilities/form/button";
import { NumberPipe } from "../../../../lib/pipes/number";
import { CustomerLoginDialog } from "../../../shared/homepage-layout/customer-login-dialog";
import { useShopContext } from "../../../../lib/providers/shop-provider";
import { useRouter } from "next/router";
import { Price } from "../../../shared/homepage-layout/price";
import { Quantity } from "../../../shared/homepage-layout/quantity";
import useDevice from "../../../../lib/hooks/useDevice";
interface Propstype extends DialogPropsType {
  cart: CartProduct[];
  onChange: Function;
  money?: number | string;
  onRemove: Function;
}

export function CartDialog(props: Propstype) {
  const router = useRouter();
  const { customer, cunstomerLogin } = useShopContext();
  const [showLogin, setShowLogin] = useState(false);
  async function onChange(qty: number, item: CartProduct) {
    console.log(qty);
    if (qty > 0) {
      props.onChange(item.product, qty);
    } else {
      props.onRemove(item.product);
    }
  }
  const { isMobile } = useDevice();
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
        <div
          className={`text-sm sm:text-base ${isMobile ? "pb-12" : ""}`}
          style={{ minHeight: `calc(100vh - 350px)` }}
        >
          {props.cart.map((item, index) => (
            <div className="flex items-center justify-between py-1.5 border-b w-full" key={index}>
              <div className="leading-7">
                <p className="text-ellipsis">
                  <span className="text-primary font-semibold">{item.qty} X </span>
                  {item.product.name}
                </p>
                <Price price={item.price} />
                {item.note && <p className="text-gray-500 text-ellipsis">Ghi chú: {item.note}</p>}
              </div>
              <Quantity quantity={item.qty} setQuantity={(val) => onChange(val, item)} />
            </div>
          ))}
        </div>
      </Dialog.Body>
      <Dialog.Footer>
        <Button
          primary
          large
          text={`Đặt hàng ${NumberPipe(props.money, true)}`}
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
}
