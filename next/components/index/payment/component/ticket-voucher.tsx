import { Button } from "../../../shared/utilities/form/button";

export function TicketVoucher({ item, index }) {
  return (
    <div className="min-w-xs flex items-center ml-4" key={index}>
      <div className="flex flex-col items-start justify-center bg-white p-4 rounded-2xl border-l-4 border-primary">
        <div className="">
          <p className="font-bold">{item.title}</p>
          <p className="">HSD: {item.duedate}</p>
        </div>
        <Button text="Xem chi tiết" textPrimary className="px-0" />
      </div>
      <div className="rounded-2xl flex items-center justify-center bg-white h-full px-4 border-l-2 border-dashed">
        <Button text="Chọn" className="px-0" textPrimary />
      </div>
    </div>
  );
}
