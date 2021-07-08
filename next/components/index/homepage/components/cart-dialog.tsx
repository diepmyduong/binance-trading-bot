import React, { useState } from "react";
import { CartProduct, useCartContext } from "../../../../lib/providers/cart-provider";
import { Dialog, DialogPropsType } from "../../../shared/utilities/dialog/dialog";
import { Button } from "../../../shared/utilities/form/button";
import { NumberPipe } from "../../../../lib/pipes/number";
import { CustomerLoginDialog } from "../../../shared/homepage-layout/customer-login-dialog";
import { useShopContext } from "../../../../lib/providers/shop-provider";
import { useRouter } from "next/router";
import { Price } from "../../../shared/homepage-layout/price";
import { Quantity } from "../../../shared/homepage-layout/quantity";
import useDevice from "../../../../lib/hooks/useDevice";
import { FaDivide } from "react-icons/fa";

interface Propstype extends DialogPropsType {}
export function CartDialog(props: Propstype) {
  const router = useRouter();
  const { customer, customerLogin } = useShopContext();
  const [showLogin, setShowLogin] = useState(false);
  const { cartProducts, totalMoney, changeProductQuantity } = useCartContext();
  const { isMobile } = useDevice();

  return (
    <Dialog
      isOpen={props.isOpen}
      onClose={props.onClose}
      title={"Giỏ hàng của bạn"}
      mobileSizeMode
      bodyClass="relative bg-white rounded"
      slideFromBottom="all"
      extraFooterClass="border-t border-gray-300"
    >
      <Dialog.Body>
        <div
          className={`text-sm sm:text-base px-4 ${isMobile ? "pb-12" : ""}`}
          style={{ minHeight: `calc(100vh - 350px)` }}
        >
          {cartProducts.map((cartProduct, index) => (
            <div key={index} className=" py-1.5 border-b ">
              <div className="flex items-center justify-between w-full">
                <div className="leading-7 flex-1 text-gray-700">
                  <div className="font-semibold">
                    <span className="text-primary">x{cartProduct.qty}</span>{" "}
                    {cartProduct.product.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {cartProduct.product.selectedToppings
                      .map((topping) => topping.optionName)
                      .join(", ")}
                  </div>
                  <div className="">
                    <span className="font-semibold">{NumberPipe(cartProduct.amount, true)}</span>
                  </div>
                </div>
                <Quantity
                  quantity={cartProduct.qty}
                  setQuantity={(qty) => changeProductQuantity(index, qty)}
                />
              </div>
              {cartProduct.note && (
                <div className="text-gray-500 text-ellipsis">Ghi chú: {cartProduct.note}</div>
              )}
            </div>
          ))}
        </div>
      </Dialog.Body>
      <Dialog.Footer>
        <Button
          primary
          text={`Đặt hàng ${NumberPipe(totalMoney, true)}`}
          className="w-full bg-gradient uppercase h-12"
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
            customerLogin(val);
            router.push("/payment", null, { shallow: true });
          }
        }}
      />
    </Dialog>
  );
}
