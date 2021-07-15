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
import { InforPayment } from "./components/infor-payment";
import { TicketVoucher } from "./components/ticket-voucher";
import { useShopContext } from "../../../lib/providers/shop-provider";
import { useToast } from "../../../lib/providers/toast-provider";
import BranchsDialog from "../homepage/components/branchs-dialog";
import { ShopVoucher, ShopVoucherService } from "../../../lib/repo/shop-voucher.repo";
import cloneDeep from "lodash/cloneDeep";
import SwiperCore, { Navigation } from "swiper/core";
import { PromotionDetailDialog } from "../promotion/components/promotion-detail.tsx/promotion-detail-dialog";
// SwiperCore.use([Pagination]);
SwiperCore.use([Navigation]);
export function PaymentPage() {
  const {
    cartProducts,
    totalFood,
    totalMoney,
    generateDraftOrder,
    setOrderInput,
    orderInput,
    draftOrder: order,
  } = useCartContext();
  const { branchSelecting, shopBranchs, setBranchSelecting } = useShopContext();
  const [voucherApplied, setVoucherApplied] = useState<ShopVoucher>(null);
  const [voucherSelected, setVoucherSelected] = useState<ShopVoucher>(null);
  const [openDialogSelectBranch, setopenDialogSelectBranch] = useState(false);
  const toast = useToast();
  const [vouchers, setVouchers] = useState<ShopVoucher[]>();
  useEffect(() => {
    generateDraftOrder();
  }, [orderInput]);
  useEffect(() => {
    if (branchSelecting) setOrderInput({ ...orderInput, shopBranchId: branchSelecting?.id });
  }, [branchSelecting]);
  useEffect(() => {
    if (!branchSelecting) {
      toast.error("Chưa chọn quán chi nhánh");
      setopenDialogSelectBranch(true);
    }
  }, [branchSelecting]);
  useEffect(() => {
    setVoucherApplied(null);
    ShopVoucherService.getAll({
      query: { order: { createdAt: -1 }, filter: { isPrivate: false, isActive: true } },
      fragment: ShopVoucherService.fullFragment,
    })
      .then((res) => setVouchers(cloneDeep(res.data)))
      .catch((err) => setVouchers(null));
  }, []);
  return (
    <>
      <div className="text-gray-700 bg-gray-100">
        <InforPayment />
        <div className="mt-1 bg-white">
          <div className="flex items-center justify-between">
            <div className="font-semibold px-4 py-2">
              {branchSelecting ? branchSelecting.name : "Chưa chọn chi nhánh"}
            </div>
            <Button
              textPrimary
              text="Đổi chi nhánh"
              small
              onClick={() => setopenDialogSelectBranch(true)}
            />
          </div>
          <div className="">
            {cartProducts.map((cartProduct, index) => {
              const last = cartProducts.length - 1 == index;
              return (
                <div
                  className={`flex px-4 items-start border-gray-300 py-3 ${!last && "border-b"}`}
                  key={index}
                >
                  <div className="font-bold text-primary flex items-center">
                    <div className="min-w-4 text-center">{cartProduct.qty}</div>
                    <div className="px-1">X</div>
                  </div>
                  <div className="flex-1 flex flex-col text-gray-700">
                    <div className="font-semibold">{cartProduct.product.name}</div>
                    {!!cartProduct.product.selectedToppings.length && (
                      <div>
                        {cartProduct.product.selectedToppings
                          .map((topping) => topping.optionName)
                          .join(", ")}
                      </div>
                    )}
                    {cartProduct.note && <div>Ghi chú: {cartProduct.note}</div>}
                  </div>
                  <div className="font-bold">{NumberPipe(cartProduct.amount, true)}</div>
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
              Phí áp dụng:{" "}
              <span className="font-bold">
                {order.order?.shipDistance ? `${order?.order?.shipDistance} km` : ""}
              </span>
            </div>
            <div className="">{NumberPipe(order?.order?.shipfee)}đ</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="">Giảm giá:</div>
            <div className="text-danger">
              {order.discount > 0
                ? NumberPipe(-order?.order?.discount, true)
                : NumberPipe(order?.order?.discount, true)}
            </div>
          </div>
        </div>
        <div className="px-2 py-4 flex w-full md:overflow-hidden overflow-auto z-0">
          {vouchers && (
            <Swiper
              spaceBetween={10}
              freeMode={true}
              grabCursor
              slidesPerView={"auto"}
              className="w-auto"
              navigation
              // className="main-container overflow-visible"
            >
              {vouchers.map((item: ShopVoucher, index) => {
                return (
                  <SwiperSlide key={index} className="w-2/3">
                    <TicketVoucher
                      voucher={item}
                      showDetail={(val) => setVoucherSelected(val)}
                      onClick={(val) => {
                        setVoucherApplied(val);
                        setOrderInput({ ...orderInput, promotionCode: val.code });
                      }}
                    />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          )}
        </div>
        <div className="h-24"></div>
        <ButtonPayment voucherApplied={voucherApplied} setVoucherApplied={setVoucherApplied} />
      </div>
      <PromotionDetailDialog
        promotion={voucherSelected}
        isOpen={voucherSelected ? true : false}
        onClose={() => setVoucherSelected(null)}
      />
      {shopBranchs && (
        <BranchsDialog
          shopBranchs={shopBranchs}
          onClose={() => setopenDialogSelectBranch(false)}
          isOpen={openDialogSelectBranch}
          onSelect={(branch) => {
            setBranchSelecting(branch);
          }}
        />
      )}
    </>
  );
}
interface ButtonPaymentProps extends ReactProps {
  voucherApplied: ShopVoucher;
  setVoucherApplied: Function;
}
const ButtonPayment = ({ voucherApplied, setVoucherApplied, ...props }: ButtonPaymentProps) => {
  const {
    generateOrder,
    orderInput,
    draftOrder: order,
    setOrderInput,
    draftOrder,
  } = useCartContext();
  const toast = useToast();
  function validData() {
    if (!orderInput.buyerName) {
      toast.error("Chưa nhập tên người nhận");
      return false;
    }
    if (!orderInput.pickupMethod) {
      toast.error("Chưa chọn phương thức nhận");
      return false;
    }
    if (!orderInput.buyerPhone) {
      toast.error("Chưa nhập số điện thoại");
      return false;
    }
    if (orderInput.pickupMethod == "DELIVERY" && !orderInput.buyerFullAddress) {
      toast.error("Chưa nhập địa chỉ giao hàng");
      return false;
    }
    return true;
  }
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
            <p className="text-primary text-sm font-semibold text-center py-1">
              {voucherApplied.code}
            </p>
            <Button
              text="Xóa"
              textDanger
              onClick={() => {
                setVoucherApplied(null);
                setOrderInput({ ...orderInput, promotionCode: "" });
              }}
            />
          </div>
        ) : (
          <Button text="Mã khuyến mãi" textPrimary className="px-0" small />
        )}
      </div>
      <div className="w-full py-2 px-4">
        <Button
          // disabled={order.invalid}
          text={order.order ? `Đặt hàng ${NumberPipe(order?.order?.amount)}đ` : "Đặt hàng"}
          primary
          className="w-full bg-gradient h-12"
          onClick={async () => {
            if (validData()) {
              if (draftOrder.invalid) {
                toast.error(draftOrder.invalidReason);
              } else {
                await generateOrder();
              }
            }
          }}
        />
      </div>
    </div>
  );
};

const InputNote = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const { orderInput, setOrderInput } = useCartContext();
  return (
    <>
      <div className="mt-1">
        {orderInput.note != "" ? (
          <div className="px-4 py-2 bg-white w-full">
            <div className="flex items-center justify-between">
              <p className="font-semibold">Ghi chú</p>
              <i className="hover:text-primary cursor-pointer" onClick={() => setOpenDialog(true)}>
                <FaPen />
              </i>
            </div>
            <p className="">{orderInput.note}</p>
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
        initialData={{ note: orderInput.note }}
        onSubmit={(data) => {
          setOrderInput({ ...orderInput, note: data.note });
          setOpenDialog(false);
        }}
      >
        <Field label="Ghi chú" name="note">
          <Textarea placeholder="Nhập ghi chú" />
        </Field>
        <Form.Footer>
          <SaveButtonGroup />
        </Form.Footer>
      </Form>
    </>
  );
};
