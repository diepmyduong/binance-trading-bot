import { useEffect, useState } from "react";
import { Dialog, DialogPropsType } from "../../../shared/utilities/dialog/dialog";
import { Img } from "../../../shared/utilities/img";
import { useRouter } from "next/router";
import { Button } from "../../../shared/utilities/form/button";
import { useShopContext } from "../../../../lib/providers/shop-provider";
import { Spinner } from "../../../shared/utilities/spinner";
interface Propstype extends DialogPropsType {
  code: string;
}

export function SuccessDialog({ code, ...props }: Propstype) {
  const { shopCode } = useShopContext();
  const [sec, setSec] = useState(4);
  const router = useRouter();
  useEffect(() => {
    if (code !== "") {
      let secTime = sec;
      let interval = setInterval(() => {
        secTime--;
        setSec(secTime);
        if (secTime === 0) {
          router.replace(`/${shopCode}/order/${code}`);
          clearInterval(interval);
        }
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [code]);
  return (
    <Dialog {...props} onClose={() => {}} mobileSizeMode={false} slideFromBottom="none">
      <Dialog.Body>
        <div className="sm:p-2 flex flex-col items-center">
          <h3 className="text-lg sm:text-32 font-bold text-primary text-center p-2">
            Đặt hàng thành công
          </h3>

          {sec !== 0 ? (
            <Img src="https://nhahang.so/assets/img/count-down.gif" className="w-3/4" />
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
