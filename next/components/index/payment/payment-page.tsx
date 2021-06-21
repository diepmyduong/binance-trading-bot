import { useEffect, useState } from "react";
import { HiChevronRight, HiDocumentAdd } from "react-icons/hi";
import { NumberPipe } from "../../../lib/pipes/number";
import { useCartContext } from "../../../lib/providers/cart-provider";
import { Accordion } from "../../shared/utilities/accordion/accordion";
import { Button } from "../../shared/utilities/form/button";
import { Field } from "../../shared/utilities/form/field";
import { Form } from "../../shared/utilities/form/form";
import { Textarea } from "../../shared/utilities/form/textarea";
import { SaveButtonGroup } from "../../shared/utilities/save-button-group";
import { InforPayment } from "./component/infor-payment";
import { TicketVoucher } from "./component/ticket-voucher";

export function PaymentPage() {
  const [openDialog, setOpenDialog] = useState(false);
  const { cart, totalFood, totalMoney } = useCartContext();
  const [voucherApplied, setVoucherApplied] = useState(null);
  useEffect(() => {
    setVoucherApplied(null);
  }, []);
  return (
    <>
      <div className="text-gray-700 ">
        <InforPayment />
        <div className="mt-1 bg-white">
          <div className="flex px-4 items-center justify-between pt-2">
            <p className="font-bold">Cơm tấm Phúc Lộc Thọ Huỳnh Tấn Phát</p>
            <i className="">
              <HiChevronRight />
            </i>
          </div>
          <div className="">
            {cart.map((item, index) => {
              return (
                <div className="flex px-4 items-start border-b border-gray-300 py-3" key={index}>
                  <div className="font-bold text-primary flex items-center">
                    <p className="min-w-5 text-center">{item.qty}</p>
                    <p className="px-2">X</p>
                  </div>
                  <div className="flex-1">
                    <p className="">{item.name}</p>
                    <p className=" text-gray-500">{item.note}</p>
                  </div>
                  <div className="font-bold">{NumberPipe(item.amount)}đ</div>
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
              Tạm tính: <span className="font-bold">{totalFood} món</span>
            </div>
            <div className="">{NumberPipe(totalMoney)}đ</div>
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
        {voucherApplied === null && (
          <div className="px-4 py-6 flex w-full overflow-auto">
            {dataVoucher.map((item, index) => {
              return (
                <TicketVoucher
                  item={item}
                  index={index}
                  onClick={() => setVoucherApplied(item.title)}
                />
              );
            })}
          </div>
        )}
        <div className="sticky shadow-2xl bottom-0 px-4 py-4 bg-white mt-2">
          <div className="flex items-center justify-between">
            <p className="">Thanh toán COD</p>
            <p className="">|</p>
            {voucherApplied !== null ? (
              <div className="flex items-center justify-between px-2">
                <p className="">{voucherApplied}</p>
                <Button text="Xóa" textDanger onClick={() => setVoucherApplied(null)} />
              </div>
            ) : (
              <Button text="Mã khuyến mãi" textPrimary className="px-0" />
            )}
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
        onSubmit={() => {
          setOpenDialog(false);
        }}
        className="px-4 pt-4"
      >
        <Field label="Ghi chú" name="note">
          <Textarea placeholder="Nhập ghi chú" />
        </Field>
        <SaveButtonGroup disableCancle />
      </Form>
    </>
  );
}

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
