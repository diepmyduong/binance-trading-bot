import React from "react";
interface Propstype extends ReactProps {
  isActive: boolean;
  openAt?: string;
  closeAt?: string;
  distance?: number;
}

export function StatusTime(props: Propstype) {
  return (
    <ul className="flex font-bold">
      <li className={`${!props.isActive && "text-danger"} pr-2`}>
        {(props.isActive && "Đang mở") || "Đã đóng cửa"}
      </li>

      {props.openAt ? (
        <li>
          - Mở cửa từ {props.openAt} - {props.closeAt}
        </li>
      ) : (
        ""
      )}
      {props.distance && <li> - Cách bạn {props.distance}km</li>}
    </ul>
  );
}
