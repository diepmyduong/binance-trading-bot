import { useState } from "react";
import { HiChevronRight, HiDocumentAdd } from "react-icons/hi";
import { NumberPipe } from "../../../lib/pipes/number";
import { Button } from "../../shared/utilities/form/button";
import { Field } from "../../shared/utilities/form/field";
import { Form } from "../../shared/utilities/form/form";
import { Input } from "../../shared/utilities/form/input";
import { Select } from "../../shared/utilities/form/select";
import { Textarea } from "../../shared/utilities/form/textarea";
import { SaveButtonGroup } from "../../shared/utilities/save-button-group";
import { TabButtonGroup } from "../../shared/utilities/tab-button-group/tab-button-group";
import { TabGroup } from "../../shared/utilities/tab/tab-group";
import { TicketVoucher } from "./component/ticket-voucher";

export function PaymentPage() {
  const initData = {
    name: "Nguyễn Văn A",
    phone: "0869698360",
    address: "749 Nguyễn Văn Linh Quận 7 TPHCM ",
  };
  const [openDialog, setOpenDialog] = useState(false);
  return (
    <>
      <div className="text-gray-700 ">
        <div className="py-6 bg-white">
          <div className="">
            <TabButtonGroup>
              <TabButtonGroup.Tab label="Giao hàng">
                <div className="px-4 pt-6 text-sm">
                  <Form initialData={initData}>
                    <Field label="Tên người nhận" name="name">
                      <Input placeholder="Nhập tên người nhận" />
                    </Field>
                    <Field label="Số điện thoại" name="phone">
                      <Input type="number" placeholder="Nhập số điện thoại" />
                    </Field>
                    <Field label="Giao đến" name="address">
                      <Input placeholder="Nhập địa chỉ nhận hàng" />
                    </Field>
                  </Form>
                </div>
              </TabButtonGroup.Tab>
              <TabButtonGroup.Tab label="Lấy tại quán">
                <div className="px-4 pt-6 text-sm">
                  <Form>
                    <Field label="Tên người nhận" name="name">
                      <Input placeholder="Nhập tên người nhận" />
                    </Field>
                    <Field label="Số điện thoại" name="phone">
                      <Input type="number" placeholder="Nhập số điện thoại" />
                    </Field>
                  </Form>
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
        <Button
          className="py-6 w-full mt-1 bg-white flex justify-start items-center"
          onClick={() => setOpenDialog(true)}
        >
          <i className="text-3xl text-primary">
            <HiDocumentAdd />
          </i>
          <p className="text-gray-400 ml-2">Nhập ghi chú</p>
        </Button>

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
        <div className="px-4 py-6 flex w-full overflow-auto">
          {dataVoucher.map((item, index) => {
            return <TicketVoucher item={item} index={index} />;
          })}
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
      <Form
        dialog
        mobileMode
        isOpen={openDialog}
        onClose={() => setOpenDialog(false)}
        className="px-4 pt-4"
      >
        <Field label="Ghi chú">
          <Textarea placeholder="Nhập ghi chú" />
        </Field>
        <SaveButtonGroup disableCancle />
      </Form>
    </>
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

const dataVoucher = [
  {
    title: "Giảm 40k cho đơn từ 150k",
    duedate: "6/8/2021",
  },
  {
    title: "Giảm 40k cho đơn từ 150k",
    duedate: "6/8/2021",
  },
  {
    title: "Giảm 40k cho đơn từ 150k",
    duedate: "6/8/2021",
  },
];
