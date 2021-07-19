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
      {native ? (
        <div className="lazyload-wrapper w-16 sm:w-24 rounded-sm h-16 sm:h-24">
          <div className="lazyload-placeholder">
            <img {...props} />
          </div>
        </div>
      ) : (
        <Img {...props} />
      )}
      {saleRate > 0 && (
        <div
          className={`absolute  bg-danger text-white font-semibold rounded-bl-3xl ${
            small
              ? "py-1 px-2 text-sm -top-1 -right-1"
              : "-top-2 -right-2 py-2 px-3 sm:p-3 sm:text-lg"
          }`}
        >
          -<span className="pl-0.5">{saleRate}</span>%
        </div>
      )}
    </div>
  );
}
