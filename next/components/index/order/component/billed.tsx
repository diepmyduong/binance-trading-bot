import { HiChevronRight } from "react-icons/hi";
import { NumberPipe } from "../../../../lib/pipes/number";
import { Button } from "../../../shared/utilities/form/button";

export function Billed({ item, index, status }) {
  return (
    <div className="w-full mt-1 bg-white text-sm" key={index}>
      <div className="flex items-center justify-between">
        <div className="p-2 flex flex-col">
          <div className="flex items-center justify-start">
            <p className="text-primary font-bold text-sm">{status}</p>
            <p className="px-2">-</p>
            <p className="">24/12/2021</p>
          </div>
          <div className="flex flex-col pt-4">
            <div className="flex items-center">
              <p className="">{item.title}</p>
              <p className="px-2">-</p>
              <p className="">{item.address}</p>
            </div>
            <div className="flex items-center">
              <p className="font-bold">{NumberPipe(item.price)}đ</p>
              <p className="ml-1">(Visa/Master)</p>
              <p className="px-2">-</p>
              <p className="">{item.count} món</p>
            </div>
          </div>
        </div>
        <i className="text-2xl mr-2 text-primary">
          <HiChevronRight />
        </i>
      </div>
      <div className="w-full flex justify-center items-center">
        <Button
          text={`${
            status == "Đang làm món" || status == "Đang giao" ? "Gọi cho nhà hàng" : "Đặt lại"
          }`}
          large
          className="w-full border border-gray-200 rounded-none"
          textPrimary
        />
      </div>
    </div>
  );
}
