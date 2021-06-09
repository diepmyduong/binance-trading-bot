import React from "react";
import { Img } from "../../../../shared/utilities/img";
interface Propstype extends ReactProps {}
const DefaultInfomation = (props: Propstype) => {
  return (
    <div className={`bg-white rounded-md shadow-lg text-center  ${props.className}`}>
      <div className="flex border-b pb-3 mb-3">
        <Img src="" avatar className="w-16 h-16" />
        <p className="flex-1 text-lg font-semibold">Cơm tấm Phúc Lộc</p>
      </div>
      <p className=" pb-4">
        <span className="font-bold">6.8km</span> - 728 Huynh tấn phát, Tân Phú
      </p>
      <p>
        <span className="font-bold">Đang mở</span> - Mở cửa từ 9:00 - 21:00
      </p>
    </div>
  );
};

export default DefaultInfomation;
