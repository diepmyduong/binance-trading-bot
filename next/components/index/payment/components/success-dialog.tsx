import { useEffect, useState } from "react";
import { Dialog, DialogPropsType } from "../../../shared/utilities/dialog/dialog";
import { Img } from "../../../shared/utilities/img";
import { useRouter } from "next/router";
import { Button } from "../../../shared/utilities/form/button";
import { useShopContext } from "../../../../lib/providers/shop-provider";
import { Spinner } from "../../../shared/utilities/spinner";
import { usePaymentContext } from "../providers/payment-provider";
import { useCartContext } from "../../../../lib/providers/cart-provider";
import useDevice from "../../../../lib/hooks/useDevice";
import useScreen from "../../../../lib/hooks/useScreen";
interface Propstype extends DialogPropsType {
  code: string;
}

export function SuccessDialog({ code, ...props }: Propstype) {
  const { shopCode } = useShopContext();
  const { clearCartProduct } = useCartContext();
  const { orderInput, setOrderInput } = usePaymentContext();
  const [sec, setSec] = useState(6);
  const router = useRouter();
  useEffect(() => {
    if (code !== "") {
      let secTime = sec;
      let interval = setInterval(() => {
        secTime--;
        setSec(secTime);
        if (secTime === 1) {
          localStorage.removeItem(shopCode + "cartProducts");
          // orderInput = { ...orderInput, note: "", promotionCode: "" };
          setOrderInput({ ...orderInput, note: "", promotionCode: "" });
          clearCartProduct();
          router.replace(`/${shopCode}/order/${code}`);
        }
        if (secTime === 0) {
          clearInterval(interval);
        }
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [code]);
  const { isMobile } = useDevice();
  const screenSm = useScreen("sm");
  return (
    <Dialog
      {...props}
      onClose={() => {}}
      slideFromBottom="none"
      extraDialogClass=" transform -translate-y-10 scale-125 sm:scale-100"
    >
      <Dialog.Body>
        <div className="sm:p-2 flex flex-col items-center">
          <h3 className="text-lg sm:text-32 font-bold text-primary text-center p-2">
            Đặt hàng thành công
          </h3>

          {sec !== 0 ? (
            <Img
              src="https://nhahang.so/assets/img/count-down.gif"
              className="w-full sm:w-5/6"
              ratio169={isMobile || !screenSm}
            />
          ) : (
            <Spinner />
          )}
          <p className="text-sm sm:text-base font-semibold my-2 text-accent-dark">
            Đang chuyển hướng...
          </p>
        </div>
      </Dialog.Body>
    </Dialog>
  );
}
