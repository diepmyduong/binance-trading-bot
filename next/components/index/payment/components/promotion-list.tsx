import { useState } from "react";
import { useToast } from "../../../../lib/providers/toast-provider";
import { ShopVoucher } from "../../../../lib/repo/shop-voucher.repo";
import { Dialog } from "../../../shared/utilities/dialog/dialog";
import { Button } from "../../../shared/utilities/form/button";
import { Input } from "../../../shared/utilities/form/input";
import { Spinner } from "../../../shared/utilities/spinner";
import { Promotion } from "../../promotion/components/promotion";
import { usePromotionContext } from "../../promotion/provider/promotion-provider";
import { usePaymentContext } from "../providers/payment-provider";

export function PromotionList(props) {
  const { shopVouchers, customerVoucher } = usePromotionContext();
  const { orderInput, setOrderInput } = usePaymentContext();
  const [voucherCode, setVoucherCode] = useState("");
  const toast = useToast();
  const handleSubmit = () => {
    var check = false;
    shopVouchers.forEach((item) => {
      if (item.code.toUpperCase() == voucherCode.toUpperCase()) {
        setOrderInput({ ...orderInput, promotionCode: item.code });
        props.onClose();
        check = true;
      }
    });
    if (!check) {
      toast.error("Không tìm thấy khuyến mãi");
      props.onClose();
    }
  };
  return (
    <div className="">
      <Dialog
        mobileSizeMode
        slideFromBottom="all"
        title="Tất cả khuyến mãi"
        className="h-screen"
        onClose={props.onClose}
        isOpen={props.isOpen}
      >
        <Dialog.Body>
          <div className="w-full flex sticky top-0">
            <Input className="flex-1" onChange={(data) => setVoucherCode(data)} />
            <Button text="Áp dụng" primary onClick={() => handleSubmit()} />
          </div>
          <div className="mt-4">
            {shopVouchers ? (
              <div className="mb-4">
                {shopVouchers.length === 0 ? (
                  <span className="h-screen font-semibold text-center">
                    Cửa hàng hiện chưa có mã khuyến mãi nào
                  </span>
                ) : (
                  <>
                    {shopVouchers.map((item: ShopVoucher, index) => (
                      <Promotion
                        key={index}
                        promotion={item}
                        onClick={() => {
                          setOrderInput({ ...orderInput, promotionCode: item.code });
                          props.onClose();
                        }}
                        selectButton
                      />
                    ))}
                  </>
                )}
              </div>
            ) : (
              <Spinner />
            )}
          </div>
        </Dialog.Body>
      </Dialog>
    </div>
  );
}
