import React from "react";
interface Propstype extends ReactProps {
  isActive: boolean;
  openAt?: string;
  closeAt?: string;
  range?: string | number;
}

export function StatusTime(props: Propstype) {
  return (
    <ul className="flex font-bold">
      <li className={`${!props.isActive && "text-danger"} pr-2`}>
        {(props.isActive && "Đang mở") || "Đã đóng cửa"}
      </li>

      {/* <li>
        - Mở cửa từ {props.openAt} - {props.closeAt}
      </li> */}
      {props.range && <li> - Cách bạn {props.range}km</li>}
    </ul>
  );
}
