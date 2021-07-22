import { ShopVoucher } from "../../../../lib/repo/shop-voucher.repo";
import { Dialog } from "../../../shared/utilities/dialog/dialog";
import { Button } from "../../../shared/utilities/form/button";
import { Input } from "../../../shared/utilities/form/input";
import { Spinner } from "../../../shared/utilities/spinner";
import { Promotion } from "../../promotion/components/promotion";
import { usePromotionContext } from "../../promotion/provider/promotion-provider";

export function PromotionList(props) {
  const { shopVouchers, customerVoucher } = usePromotionContext();
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
            <Input className="flex-1" />
            <Button text="Áp dụng" primary />
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
                          console.log(item.code);
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
