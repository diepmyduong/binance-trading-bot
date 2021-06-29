import Link from "next/link";
import { Button } from "../../../shared/utilities/form/button";

export function TicketVoucher({ item, index, onClick }) {
  return (
    <div className="min-w-max flex items-center h-full" key={index}>
      <div className="h-full w-2 bg-primary rounded-l-2xl"></div>
      <div className="flex flex-col items-start justify-center bg-white py-2 px-2 rounded-r-xl">
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
      <div className="rounded-r-2xl rounded-l-xl  flex items-center justify-center bg-white h-full px-2 border-l-2 border-dashed">
        <Button text="Chọn" className="px-0" textPrimary onClick={() => onClick()} />
      </div>
    </div>
  );
}
