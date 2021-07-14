import React from "react";
import { Img } from "../../../shared/utilities/img";
import { ShopVoucher } from "../../../../lib/repo/shop-voucher.repo";
interface Propstype extends ReactProps {
  promotion: ShopVoucher;
  onClick?: (e) => void;
}

export function Promotion(props: Propstype) {
  return (
    <div
      className="flex cursor-pointer shadow-md border-l-8 rounded-lg overflow-hidden text-sm sm:text-base border-primary items-center mb-3"
      onClick={props.onClick}
    >
      <div className="shadow-xl bg-white px-3 py-2 sm:py-4 flex items-center flex-1">
        <Img
          src={props.promotion.image || "/assets/img/defaultvoucher.png"}
          className="w-14 h-14 rounded-md"
        />
        <div className="sm:leading-7 flex-1 px-3">
          <p className="font-bold">{props.promotion.description}</p>
          {props.promotion.endDate && <p>HSD: {props.promotion.endDate}</p>}
        </div>
      </div>
      {/* <hr className="h-14 border-r-2 bg-white border-dashed border-gray-400" />
      <div className="bg-white rounded-l-2xl rounded-r-lg py-2 sm:py-4 shadow-lg">
        <Button text="Xem" className="h-14 text-primary" />
      </div> */}
    </div>
  );
}
