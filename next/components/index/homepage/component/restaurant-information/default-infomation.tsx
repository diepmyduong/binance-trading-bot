import React from "react";
import { Img } from "../../../../shared/utilities/img";
import StatusTime from "../../../../shared/infomation/status-time";
interface Propstype extends ReactProps {
  info: {
    name: string;
    address: string;
    open?: string;
    close?: string;
  };
}
const DefaultInfomation = (props: Propstype) => {
  return (
    <div className={`bg-white rounded-md shadow-lg text-center  ${props.className}`}>
      <p className="text-xl font-semibold pb-4">{props.info.name}</p>
      <p className=" pb-4">{props.info.address}</p>
      <StatusTime isActive openAt="9:00" closeAt="21:00" />
    </div>
  );
};

export default DefaultInfomation;
