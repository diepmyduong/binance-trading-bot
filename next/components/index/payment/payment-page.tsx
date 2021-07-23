import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaPen } from "react-icons/fa";
import { HiChevronUp, HiDocumentAdd } from "react-icons/hi";
import SwiperCore, { Navigation } from "swiper/core";
import { Swiper, SwiperSlide } from "swiper/react";

import { NumberPipe } from "../../../lib/pipes/number";
import { useCartContext } from "../../../lib/providers/cart-provider";
import { useShopContext } from "../../../lib/providers/shop-provider";
import { useToast } from "../../../lib/providers/toast-provider";
import { ShopVoucher } from "../../../lib/repo/shop-voucher.repo";
import { Button } from "../../shared/utilities/form/button";
import { Field } from "../../shared/utilities/form/field";
import { Form } from "../../shared/utilities/form/form";
import { Textarea } from "../../shared/utilities/form/textarea";
import { SaveButtonGroup } from "../../shared/utilities/save-button-group";
import { Spinner } from "../../shared/utilities/spinner";
import { BranchsDialog } from "../homepage/components/branchs-dialog";
import { PromotionDetailDialog } from "../promotion/components/promotion-detail.tsx/promotion-detail-dialog";
import { PromotionProvider } from "../promotion/provider/promotion-provider";
import { InforPayment } from "./components/infor-payment";
import { PromotionList } from "./components/promotion-list";
import { SuccessDialog } from "./components/success-dialog";
import { TicketVoucher } from "./components/ticket-voucher";
import { PaymentProvider, usePaymentContext } from "./providers/payment-provider";

// SwiperCore.use([Pagination]);
SwiperCore.use([Navigation]);

export function PaymentPage() {
  const { cartProducts } = useCartContext();
  const { customer, shop } = useShopContext();
  if (!customer || !shop || !cartProducts) return <Spinner />;
  return (
    <>
      <PaymentProvider>
        <Payment />
        <PaymentSuccess />
        {/* <SuccessDialog/> */}
      </PaymentProvider>
    </>
  );
}

function PaymentSuccess() {
  const { orderCode } = usePaymentContext();
  return <SuccessDialog isOpen={orderCode ? true : false} code={orderCode} />;
}

function Payment() {
  const { orderInput } = usePaymentContext();
  if (!orderInput) return <Spinner />;
  return (
    <div className="text-gray-700 bg-gray-100">
      <InforPayment />
      <div className="mt-1 bg-white">
        <BrandInfo></BrandInfo>
        <ListOrderItem></ListOrderItem>
      </div>
      <InputNote />
      <OrderSummary />
      <VoucherSlider />
      <div className="h-24"></div>
      <ButtonPayment />
    </div>
  );
}

function BrandInfo() {
  const { branchSelecting, shopBranchs, setBranchSelecting } = useShopContext();
  const [openDialogSelectBranch, setopenDialogSelectBranch] = useState(false);
  useEffect(() => {
    console.log(shopBranchs);
    if (branchSelecting === null) {
      setopenDialogSelectBranch(true);
    }
  }, []);
  return (
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
      <BranchsDialog
        shopBranchs={shopBranchs}
        onClose={() => setopenDialogSelectBranch(false)}
        isOpen={openDialogSelectBranch}
        onSelect={(branch) => {
          setBranchSelecting(branch);
        }}
      />
    </div>
  );
}

function ListOrderItem(props) {
  const { cartProducts } = useCartContext();
  const { shopCode } = useShopContext();
  if (cartProducts.length == 0)
    return (
      <div className="min-h-screen flex flex-col w-full items-center">
        <div className="pt-20">Chưa có sản phẩm trong giỏ hàng</div>
        <Button text="Về trang chủ" primary className="bg-gradient" href={`/${shopCode}`} />
      </div>
    );
  return (
    <div className="">
      {cartProducts.map((cartProduct, index) => {
        const last = cartProducts.length - 1 == index;
        return (
          <div
            className={`flex px-4 items-start border-gray-100 py-3 ${!last && "border-b"}`}
            key={index}
          >
            <div className="font-bold text-primary flex items-center">
              <div className="min-w-4 text-center">{cartProduct.qty}</div>
              <div className="px-1">X</div>
            </div>
            <div className="flex-1 flex flex-col text-gray-700">
              <div className="font-semibold">{cartProduct.product.name}</div>
              {!!cartProduct.product.selectedToppings?.length && (
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
  );
}

function DetailRow({ label, value, subfix, danger = false }) {
  return (
    <div className="flex justify-between items-center">
      <div className="">
        {label}: <span className="font-bold">{value}</span>
      </div>
      <div className={danger ? "text-danger" : ""}>{subfix}</div>
    </div>
  );
}

function OrderSummary(props) {
  const { draftOrder } = usePaymentContext();
  if (!draftOrder || !draftOrder.order) return <Spinner />;
  return (
    <div className="px-4 py-4 mt-1 bg-white ">
      <DetailRow
        label="Tạm tính"
        value={`${draftOrder.order.itemCount} món`}
        subfix={`${NumberPipe(draftOrder.order.subtotal)}đ`}
      />
      <DetailRow
        label="Phí áp dụng"
        value={draftOrder.order.shipDistance ? `${draftOrder.order.shipDistance} km` : ""}
        subfix={`${NumberPipe(draftOrder.order.shipfee)}đ`}
      />
      <DetailRow
        label="Giảm giá"
        value=""
        subfix={
          draftOrder.order.discount > 0
            ? NumberPipe(-draftOrder.order.discount, true)
            : NumberPipe(0, true)
        }
        danger
      />
      {draftOrder.invalid && (
        <div className="flex justify-between items-center">
          {/* <div className="">Giảm giá:</div> */}
          <div className="text-danger">{draftOrder.invalidReason}</div>
        </div>
      )}
    </div>
  );
}

function VoucherSlider(props) {
  const { vouchers, setOrderInput, orderInput } = usePaymentContext();
  const [voucherSelected, setVoucherSelected] = useState<ShopVoucher>(null);
  if (!vouchers) return <Spinner />;
  if (vouchers.length == 0) return <></>;
  return (
    <>
      <Swiper
        spaceBetween={10}
        freeMode={true}
        grabCursor
        slidesPerView={"auto"}
        className="w-auto p-4"
        navigation // className="main-container overflow-visible"
      >
        {vouchers.map((item: ShopVoucher, index) => {
          return (
            <SwiperSlide key={index} className="w-2/3">
              <TicketVoucher
                voucher={item}
                showDetail={setVoucherSelected}
                onClick={(val) => {
                  setOrderInput({ ...orderInput, promotionCode: val.code });
                }}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
      <PromotionDetailDialog
        promotion={voucherSelected}
        isOpen={voucherSelected ? true : false}
        onClose={() => setVoucherSelected(null)}
      />
    </>
  );
}

interface ButtonPaymentProps extends ReactProps {}
const ButtonPayment = (props: ButtonPaymentProps) => {
  const {
    generateOrder,
    orderInput,
    draftOrder: order,
    setOrderInput,
    draftOrder,
    orderCode,
  } = usePaymentContext();
  const toast = useToast();
  const [isOpenListPromotion, setIsOpenListPromotion] = useState(false);
  function validData() {
    if (!orderInput.shopBranchId) {
      toast.error("Chưa chọn chi nhánh");
      return false;
    }
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
    let dayCur = new Date();
    let datePickup = new Date(orderInput.pickupTime);
    if (orderInput.pickupMethod == "STORE" && datePickup < dayCur) {
      toast.error("Thời gian nhận hàng không hợp lệ");
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
        {orderInput.promotionCode ? (
          <div className="flex items-center justify-between px-2">
            <p className="text-primary text-sm font-semibold text-center py-1">
              {orderInput.promotionCode}
            </p>
            <Button
              text="Xóa"
              textDanger
              onClick={() => {
                setOrderInput({ ...orderInput, promotionCode: "" });
              }}
            />
          </div>
        ) : (
          <Button
            text="Mã khuyến mãi"
            onClick={() => setIsOpenListPromotion(true)}
            textPrimary
            className="px-0"
            small
          />
        )}
      </div>
      <div className="w-full py-2 px-4">
        <Button
          disabled={order.invalid}
          text={order.order ? `Đặt hàng ${NumberPipe(order?.order?.amount)}đ` : "Đặt hàng"}
          primary
          className="w-full bg-gradient h-12"
          onClick={() => {
            if (validData()) {
              if (draftOrder.invalid) {
                toast.error(draftOrder.invalidReason || "Đã xảy ra lỗi");
              } else {
                generateOrder();
              }
            }
          }}
        />
      </div>
      <PromotionProvider>
        <PromotionList isOpen={isOpenListPromotion} onClose={() => setIsOpenListPromotion(false)} />
      </PromotionProvider>
    </div>
  );
};

const InputNote = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const { orderInput, setOrderInput } = usePaymentContext();
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
          <SaveButtonGroup onCancel={() => setOpenDialog(false)} />
        </Form.Footer>
      </Form>
    </>
  );
};
