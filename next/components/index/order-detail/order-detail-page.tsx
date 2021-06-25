import { BiRadio } from "react-icons/bi";
import { CgRadioChecked } from "react-icons/cg";
import { FaCircle } from "react-icons/fa";
import { HiArrowRight, HiChevronRight } from "react-icons/hi";
import { NumberPipe } from "../../../lib/pipes/number";
import { Button } from "../../shared/utilities/form/button";

export function OrderDetailPage() {
  return (
    <div className="text-gray-800">
      <div className="w-full text-sm bg-white px-4">
        <div className="grid grid-cols-2 w-full pt-4">
          <div className="flex flex-col space-y-1">
            <p className="text-xs text-gray-500">Mã đơn hàng</p>
            <p className="uppercase font-bold">AVZK QWPE ALKD</p>
          </div>
          <div className="flex flex-col space-y-1 pl-2 border-l">
            <p className="text-xs text-gray-500">Tình trạng</p>
            <p className="text-accent">Chưa xác nhận</p>
          </div>
        </div>
        <div className="flex items-center">
          <i className="text-primary text-xl ">
            <CgRadioChecked />
          </i>
          <div className="text-xs py-6 flex flex-col space-y-1 ml-2">
            <p className="text-gray-500">Gửi đến</p>
            <p className="">
              <span className="font-bold">Uy Minh</span>(086 9698 360)
            </p>
            <p className="">block B4 chung cư Thạnh Mỹ Lợi ở Thủ Đức, Hồ Chí Minh</p>
          </div>
        </div>
      </div>
      <div className="mt-1 bg-white">
        <p className="font-bold px-4 py-2">Cơm tấm Phúc Lộc Thọ Huỳnh Tấn Phát</p>
        <div className="">
          {data.map((item, index) => {
            return (
              <div className="flex px-4 items-start border-b border-gray-300 py-3" key={index}>
                <div className="font-bold text-primary flex items-center">
                  <p className="min-w-5 text-center">{item.count}</p>
                  <p className="px-2">X</p>
                </div>
                <div className="flex-1">
                  <p className="">{item.title}</p>
                  <p className=" text-gray-500">{item.note}</p>
                </div>
                <div className="font-bold">{NumberPipe(item.price)}đ</div>
              </div>
            );
          })}
        </div>
        <div className="px-4 py-6 border-b border-gray-300">
          <div className="flex justify-between items-center">
            <div className="">
              Tạm tính: <span className="font-bold">2 món</span>
            </div>
            <div className="">{NumberPipe(519000)}đ</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="">
              Phí áp dụng: <span className="font-bold">1.2 km</span>
            </div>
            <div className="">{NumberPipe(20000)}đ</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="">Giảm giá:</div>
            <div className="text-accent">{NumberPipe(40000)}đ</div>
          </div>
        </div>
        <div className="px-4 py-6 flex items-center justify-between">
          <div className="">Tổng cộng:</div>
          <div className="font-bold">{NumberPipe(900000)}đ</div>
        </div>
        <div className="p-2 sticky bottom-0 w-full bg-white">
          <Button text="Gọi nhà hàng" primary large className="w-full" />
        </div>
      </div>
    </div>
  );
}

const data = [
  {
    title: "Rau má đậu xanh",
    count: 12,
    note: "Không đá ít đường",
    price: 119000,
  },
  {
    title: "Cơm đùi gà quay",
    count: 2,
    note: "Không cơm ít gà",
    price: 119000,
  },
];
