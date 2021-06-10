import { HiChevronRight, HiDocumentAdd } from "react-icons/hi";
import { NumberPipe } from "../../../lib/pipes/number";
import { Button } from "../../shared/utilities/form/button";
import { Select } from "../../shared/utilities/form/select";
import { TabButtonGroup } from "../../shared/utilities/tab-button-group/tab-button-group";
import { TabGroup } from "../../shared/utilities/tab/tab-group";

export function PaymentPage() {
  return (
    <div className="text-gray-700 ">
      <div className="py-6 bg-white">
        <div className="">
          <TabButtonGroup>
            <TabButtonGroup.Tab label="Giao hàng">
              <div className="px-4 pt-6">
                <div className="flex items-center">
                  <p className="">Uy</p>
                  <p className="px-2">-</p>
                  <p className="">0965 696 363</p>
                </div>
                <div className="flex items-start justify-between">
                  <p className="">
                    Block B4 chung cư Thạnh Mỹ Lợi ở Thủ Đức, thành phố Hồ Chí Minh
                  </p>
                  <Button text="Thay đổi" textPrimary className="px-0 py-0 min-w-max text-sm" />
                </div>
              </div>
            </TabButtonGroup.Tab>
            <TabButtonGroup.Tab label="Lấy tại quán">
              <div className="px-4 pt-6">
                <div className="font-bold">Quán chi nhánh 1</div>
                <div className="flex items-start justify-between">
                  <p className="">110 Nguyễn Văn Linh, F. Tân Thuận Tây, Quận 7, Hồ Chí Minh</p>
                  <Button
                    text="Đổi chi nhánh"
                    textPrimary
                    className="px-0 py-0 min-w-max text-sm"
                  />
                </div>
                <div className="flex items-center justify-between pt-6">
                  <p className="">Chọn thời gian lấy:</p>
                  <Select
                    options={[
                      { label: "14:00", value: "14" },
                      { label: "15:00", value: "15" },
                      { label: "16:00", value: "16" },
                    ]}
                    className="w-28"
                  />
                </div>
              </div>
            </TabButtonGroup.Tab>
          </TabButtonGroup>
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
      </div>
      <div className="px-4 py-3 mt-1 bg-white flex items-center">
        <i className="text-3xl text-primary">
          <HiDocumentAdd />
        </i>
        <p className="text-gray-400 ml-2">Nhập ghi chú</p>
      </div>

      <div className="px-4 py-4 mt-1 bg-white ">
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
      <div className="sticky bottom-0 px-4 py-4 bg-white mt-1">
        <div className="flex items-center justify-between">
          <p className="">Thanh toán COD</p>
          <p className="">|</p>
          <Button text="Mã khuyến mãi" textPrimary className="px-0" />
        </div>
        <div className="w-full pt-2">
          <Button text={`Thanh toán ${NumberPipe(189000)}đ`} primary className="w-full" />
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
