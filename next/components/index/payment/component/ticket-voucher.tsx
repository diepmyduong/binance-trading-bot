import { Button } from "../../../shared/utilities/form/button";

export function TicketVoucher({ item, index, onClick }) {
  return (
    <div className="min-w-xs flex items-center ml-4" key={index}>
      <div className="h-full w-2 bg-primary rounded-l-2xl"></div>
      <div className="flex flex-col items-start justify-center bg-white py-2 px-4 rounded-r-2xl">
        <div className="">
          <p className="font-bold">{item.title}</p>
          <p className="">HSD: {item.duedate}</p>
        </div>
        <Button text="Xem chi tiết" textPrimary className="px-0" />
      </div>
      <div className="rounded-2xl flex items-center justify-center bg-white h-full px-4 border-l-2 border-dashed">
        <Button text="Chọn" className="px-0" textPrimary onClick={() => onClick()} />
      </div>
    </div>
  );
}
