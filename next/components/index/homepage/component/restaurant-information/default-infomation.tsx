import React from "react";
import { Img } from "../../../../shared/utilities/img";
interface Propstype extends ReactProps {}
const DefaultInfomation = (props: Propstype) => {
  return (
    <div className={`bg-white rounded-md shadow-lg text-center  ${props.className}`}>
      <p className="text-xl font-semibold pb-4">Cơm tấm Phúc Lộc Thọ</p>
      <p className=" pb-4">728 Huynh tấn phát, Tân Phú</p>
      <p>
        <span className="font-bold">Đang mở</span> - Mở cửa từ 9:00 - 21:00
      </p>
    </div>
  );
};

export default DefaultInfomation;
