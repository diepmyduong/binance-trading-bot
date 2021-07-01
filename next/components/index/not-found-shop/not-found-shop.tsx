import React from "react";
import { ShopClosed } from "../../../public/assets/svg/svg";
import { Img } from "../../shared/utilities/img";

export function NotFoundShop() {
  return (
    <div className="text-center min-h-lg pt-24 px-4 bg-white h-screen flex flex-col items-center">
      <Img src="/assets/img/closed.png" className="w-24 pb-4" />
      Không tìm thấy cửa hàng. Vui lòng kiểm tra lại đường dẫn.
    </div>
  );
}
