import { useEffect, useState } from "react";
import { Dialog, DialogPropsType } from "../../../shared/utilities/dialog/dialog";
import { Img } from "../../../shared/utilities/img";
import { useRouter } from "next/router";
import { Button } from "../../../shared/utilities/form/button";
import { useShopContext } from "../../../../lib/providers/shop-provider";
interface Propstype extends DialogPropsType {
  code: string;
}

export function SuccessDialog({ code, ...props }: Propstype) {
  const { shopCode } = useShopContext();
  const [sec, setSec] = useState(3);
  const router = useRouter();
  // useEffect(() => {
  //   let interval = setInterval(() => {
  //     // if (sec === 0) {
  //     //   router.replace(`/order/${code}`);
  //     //   clearInterval(interval);
  //     // }
  //     setSec(sec - 1);
  //   });
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);
  return (
    <Dialog {...props} onClose={() => {}} mobileSizeMode={false} slideFromBottom="none">
      <Dialog.Body>
        <div className="sm:p-2 flex flex-col items-center">
          <h3 className="text-lg sm:text-32 font-bold text-primary text-center p-2">
            Đặt hàng thành công
          </h3>
          <p className="text-sm sm:text-lg">Chúng tôi sẽ chuyển bạn đến trang đơn hàng trong</p>
          <Img src="https://nhahang.so/assets/img/count-down.gif" className="w-3/4" />
        </div>
      </Dialog.Body>
      <Dialog.Footer>
        <Button
          text="Về trang chủ"
          className="w-auto sm:w-2/5 sm:text-base text-sm"
          href={`/${shopCode}`}
        />
        <Button
          text="Đến ngay"
          primary
          className="bg-gradient w-auto sm:w-3/5 sm:text-base text-sm"
          href={`/order/${code}`}
        />
      </Dialog.Footer>
    </Dialog>
  );
}
