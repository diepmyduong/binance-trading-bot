import React, { useState } from "react";

import useScreen from "../../../../../lib/hooks/useScreen";
import { Product } from "../../../../../lib/repo/product.repo";
import TableTechs from "./table-techs";

interface Propstype extends ReactProps {
  product: Product;
}
const Description = (props: Propstype) => {
  const [des, setDes] = useState(true);
  const screenSm = useScreen("sm");
  return (
    <div className="space-y-4 text-sm sm:text-base">
      <h3 className="text-primary">Mô tả</h3>
      <div className="space-x-4 flex">
        {(screenSm && (
          <>
            <button
              className={`rounded-full ${(des && "btn-primary") || "btn-outline"}`}
              onClick={() => setDes(true)}
            >
              Thông tin chi tiết
            </button>
            <button
              className={`rounded-full ${(!des && "btn-primary") || "btn-outline"}`}
              onClick={() => setDes(false)}
            >
              Thông tin kỹ thuật
            </button>
          </>
        )) || (
          <>
            <button
              className={`rounded-full btn-sm ${(des && "btn-primary") || "btn-outline"}`}
              onClick={() => setDes(true)}
            >
              Chi tiết
            </button>
            <button
              className={`rounded-full btn-sm ${(!des && "btn-primary") || "btn-outline"}`}
              onClick={() => setDes(false)}
            >
              Kỹ thuật
            </button>
          </>
        )}
      </div>
      <div className="overflow-hidden relative">
        <div
          className={`w-full absolute top-0 ${
            (des && " animate-scale-up") || " animate-scale-down"
          } `}
        >
          <h3 className="text-primary font-bold">{props.product.name}</h3>
          {(props.product.description && (
            <div
              className="ql-editor ql-snow mb-10 mt-5 px-5 text-sm"
              dangerouslySetInnerHTML={{ __html: props.product.description }}
            ></div>
          )) || <p>Chưa có mô tả chi tiết</p>}
        </div>
        <TableTechs
          className={`w-full sticky top-0 ${
            (!des && " animate-scale-up") || " animate-scale-down"
          }`}
          options={props.product.params}
        />
      </div>
    </div>
  );
};

export default Description;
