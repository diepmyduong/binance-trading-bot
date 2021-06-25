import Link from "next/link";
import { Button } from "../../../shared/utilities/form/button";

export function TicketVoucher({ item, index, onClick }) {
  return (
    <div
      className="md:max-w-xs md:min-w-min min-w-max flex items-center ml-4 md:ml-2 max-h-32"
      key={index}
    >
      <div className="h-full w-3 bg-primary rounded-l-2xl"></div>
      <div className="flex flex-col items-start justify-center bg-white py-2 px-2 rounded-r-2xl">
        <div className="">
          <div className="text-sm font-bold">{item.title}</div>
          <div className="text-xs">HSD: {item.duedate}</div>
        </div>
        <Link href="">
          <a href="" className="text-xs font-semibold text-primary pt-1">
            Xem chi tiết
          </a>
        </Link>
      </div>
      <div className="rounded-2xl flex items-center justify-center bg-white h-full px-2 border-l-2 border-dashed">
        <Button text="Chọn" className="px-0" textPrimary onClick={() => onClick()} />
      </div>
    </div>
  );
}
