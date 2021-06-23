import React from "react";
interface Propstype extends ReactProps {
  isActive: boolean;
  openAt: string;
  closeAt: string;
}

const StatusTime = (props: Propstype) => {
  return (
    <p>
      <span className="font-bold">{(props.isActive && "Đang mở") || "Đã đóng cửa"}</span> - Mở cửa
      từ {props.openAt} - {props.closeAt}
    </p>
  );
};

export default StatusTime;
