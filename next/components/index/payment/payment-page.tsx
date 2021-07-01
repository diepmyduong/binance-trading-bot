import { useEffect, useState } from "react";
import { FaPen } from "react-icons/fa";

import { Swiper, SwiperSlide } from "swiper/react";
import { HiChevronUp, HiDocumentAdd } from "react-icons/hi";
import { NumberPipe } from "../../../lib/pipes/number";
import { useCartContext } from "../../../lib/providers/cart-provider";
import { Button } from "../../shared/utilities/form/button";
import { Field } from "../../shared/utilities/form/field";
import { Form } from "../../shared/utilities/form/form";
import { Textarea } from "../../shared/utilities/form/textarea";
import { SaveButtonGroup } from "../../shared/utilities/save-button-group";
import { InforPayment } from "./component/infor-payment";
import { TicketVoucher } from "./component/ticket-voucher";

export function PaymentPage() {
  const { cart, totalFood, totalMoney } = useCartContext();
  const [voucherApplied, setVoucherApplied] = useState(null);
  useEffect(() => {
    setVoucherApplied(null);
  }, []);
  return (
    <>
      <div className="text-gray-700">
        <InforPayment />
        <div className="mt-1 bg-white">
          <p className="font-semibold px-4 py-2">Cơm tấm Phúc Lộc Thọ Huỳnh Tấn Phát</p>
          <div className="">
            {cart.map((item, index) => {
              const last = cart.length - 1 == index;
              return (
                <div
                  className={`flex px-4 items-start border-gray-300 py-3 ${!last && "border-b"}`}
                  key={index}
                >
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
        <InputNote />
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
        <div className="px-2 py-4 flex w-full md:overflow-hidden overflow-auto z-0">
          <Swiper freeMode slidesPerView={"auto"} spaceBetween={12} className="">
            {dataVoucher.map((item, index) => {
              return (
                <SwiperSlide className="max-w-max" key={index}>
                  <TicketVoucher
                    item={item}
                    index={index}
                    onClick={() => setVoucherApplied(item.title)}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
        <div className="h-24"></div>
        <ButtonPayment voucherApplied={voucherApplied} setVoucherApplied={setVoucherApplied} />
      </div>
    </>
  );
}

const ButtonPayment = ({ voucherApplied, setVoucherApplied }) => {
  return (
    <div className="fixed text-sm max-w-lg w-full z-50 shadow-2xl bottom-0  bg-white mt-2 border-b border-l border-r border-gray-300">
      <div className="grid grid-cols-2 px-4 border-t border-b border-gray-100 items-center justify-between">
        <div className="flex items-center justify-center font-semibold w-full border-r h-full border-gray-100">
          <p className="text-center">Thanh toán COD</p>
          <i className="ml-2 text-xl">
            <HiChevronUp />
          </i>
        </div>

        {voucherApplied !== null ? (
          <div className="flex items-center justify-between px-2">
            <p className="text-primary text-sm font-semibold text-center py-1">{voucherApplied}</p>
            <Button text="Xóa" textDanger onClick={() => setVoucherApplied(null)} />
          </div>
        ) : (
          <Button text="Mã khuyến mãi" textPrimary className="px-0" small />
        )}
      </div>
      <div className="w-full py-2 px-4">
        <Button text={`Thanh toán ${NumberPipe(189000)}đ`} primary className="w-full" />
      </div>
    </div>
  );
};

const InputNote = () => {
  const [note, setNote] = useState({ note: "" });
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <div className="mt-1">
        {note.note != "" ? (
          <div className="px-4 py-2 bg-white w-full">
            <div className="flex items-center justify-between">
              <p className="font-semibold">Ghi chú</p>
              <i className="hover:text-primary cursor-pointer" onClick={() => setOpenDialog(true)}>
                <FaPen />
              </i>
            </div>
            <p className="">{note.note}</p>
          </div>
        ) : (
          <Button
            className="py-6 w-full mt-1 bg-white flex justify-start items-center"
            onClick={() => setOpenDialog(true)}
          >
            <i className="text-3xl text-primary">
              <HiDocumentAdd />
            </i>
            <p className="text-gray-400 ml-2">Nhập ghi chú</p>
          </Button>
        )}
      </div>
      <Form
        dialog
        mobileSizeMode
        isOpen={openDialog}
        onClose={() => setOpenDialog(false)}
        initialData={note}
        onSubmit={(data) => {
          setNote(data);
          setOpenDialog(false);
        }}
        className=""
      >
        <Field label="Ghi chú" name="note">
          <Textarea placeholder="Nhập ghi chú" />
        </Field>
        <SaveButtonGroup disableCancle />
      </Form>
    </>
  );
};

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
