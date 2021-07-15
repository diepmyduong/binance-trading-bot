import { createContext, useContext, useEffect, useState } from "react";
import cloneDeep from "lodash/cloneDeep";
import { ShopVoucher, ShopVoucherService } from "../../../../lib/repo/shop-voucher.repo";
import {
  CustomerVoucherService,
  CustomerVoucher,
} from "../../../../lib/repo/customer-voucher.repo";

export const PromotionContext = createContext<
  Partial<{ shopVouchers: ShopVoucher[]; customerVoucher: CustomerVoucher[] }>
>({});

export function PromotionProvider(props) {
  const [shopVouchers, setShopVouchers] = useState<ShopVoucher[]>();
  const [customerVoucher, setCustomerVoucher] = useState<CustomerVoucher[]>();
  async function loadPromotions() {
    setShopVouchers(null);
    let res = await ShopVoucherService.getAll({
      query: { order: { createdAt: -1 }, filter: { isPrivate: false, isActive: true } },
      fragment: ShopVoucherService.fullFragment,
    });
    let cus = await CustomerVoucherService.getAll({
      query: { order: { createdAt: -1 } },
      fragment: CustomerVoucherService.fullFragment,
    });
    if (res) {
      setShopVouchers(cloneDeep(res.data));
    }
    if (cus) {
      setCustomerVoucher(cloneDeep(cus.data));
    }
  }
  useEffect(() => {
    loadPromotions();
  }, []);
  return (
    <PromotionContext.Provider value={{ shopVouchers, customerVoucher }}>
      {props.children}
    </PromotionContext.Provider>
  );
}

export const usePromotionContext = () => useContext(PromotionContext);
export const PromotionConsumer = ({
  children,
}: {
  children: (
    props: Partial<{ shopVouchers: ShopVoucher[]; customerVoucher: CustomerVoucher[] }>
  ) => any;
}) => {
  return <PromotionContext.Consumer>{children}</PromotionContext.Consumer>;
};
