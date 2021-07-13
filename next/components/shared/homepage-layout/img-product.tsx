import React from "react";
import { ImgProps, Img } from "../utilities/img";
interface Propstype extends ImgProps {
  saleRate: number;
  small?: boolean;
  native?: boolean;
}

export function ImgProduct({ saleRate, small = false, native = false, ...props }: Propstype) {
  return (
    <div className="relative overflow-hidden rounded-md">
      {native ? <img {...props} /> : <Img {...props} />}
      {saleRate > 0 && (
        <div
          className={`absolute -top-2 -right-2 bg-danger text-white sm:text-lg font-semibold rounded-bl-3xl ${
            small ? "py-2 px-3" : "py-2 px-3 sm:p-3"
          }`}
        >
          -<span className="pl-0.5">{saleRate}</span>%
        </div>
      )}
    </div>
  );
}
