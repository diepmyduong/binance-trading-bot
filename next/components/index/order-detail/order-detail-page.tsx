import { HiArrowRight, HiChevronRight } from "react-icons/hi";
import { NumberPipe } from "../../../lib/pipes/number";
import { Button } from "../../shared/utilities/form/button";

export function OrderDetailPage() {
  return (
    <div className="text-gray-800">
      <div className="w-full text-sm bg-white ">
        <div className="w-full flex flex-col items-center py-4">
          <div className="w-full max-w-28 px-4 py-1 rounded-sm text-center bg-red-100 text-red-600">
            Đã hủy
          </div>
          <div className="w-full py-1 text-center">15:23 - 12/05/2021</div>
        </div>
        <div className="mx-4 p-3 bg-gray-100 rounded text-gray-500">
          Đổi món ăn, không muốn đặt nữa
        </div>
        <div className="px-4 grid grid-cols-3 py-6 gap-y-1 md:text-sm">
          <div className="font-bold">Mã đơn hàng</div>
          <div className="col-span-2">FJASDOFJ</div>
          <div className="font-bold">Tài xế</div>
          <div className="col-span-2">Nguyễn Lê Hữu Thành - 0903 878 252</div>
          <div className="font-bold">Tên khách</div>
          <div className="col-span-2">Uy Minh - 0608 666 888</div>
          <div className="font-bold">Giao đến</div>
          <div className="col-span-2">block B4 chung cư Thạnh Mỹ Lợi ở Thủ Đức, Hồ Chí Minh</div>
        </div>
      </div>
      <div className="mt-1 bg-white">
        <div className="flex px-4 items-center justify-between pt-2">
          <p className="font-bold">Cơm tấm Phúc Lộc Thọ Huỳnh Tấn Phát</p>
          <i className="">
            <HiChevronRight />
          </i>
        </div>
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
          <Button text="Đặt lại" primary large className="w-full" />
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
