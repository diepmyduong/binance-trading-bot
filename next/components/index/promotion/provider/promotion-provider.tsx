import { createContext, useContext, useEffect, useState } from "react";
import cloneDeep from "lodash/cloneDeep";
import { ShopVoucher, ShopVoucherService } from "../../../../lib/repo/shop-voucher.repo";

export const PromotionContext = createContext<Partial<{ shopVouchers: ShopVoucher[] }>>({});

export function PromotionProvider(props) {
  const [shopVouchers, setShopVouchers] = useState<ShopVoucher[]>();
  // const [customerVoucher, setCustomerVoucher] = useState<Customerv>();
  async function loadPromotions() {
    setShopVouchers(null);
    let res = await ShopVoucherService.getAll({
      query: { order: { createdAt: -1 } },
      fragment: ShopVoucherService.fullFragment,
    });
    if (res) {
      setShopVouchers(cloneDeep(res.data));
    }
  }
  useEffect(() => {
    loadPromotions();
  }, []);
  return (
    <PromotionContext.Provider value={{ shopVouchers }}>{props.children}</PromotionContext.Provider>
  );
}

export const usePromotionContext = () => useContext(PromotionContext);
export const PromotionConsumer = ({
  children,
}: {
  children: (props: Partial<{ shopVouchers: ShopVoucher[] }>) => any;
}) => {
  return <PromotionContext.Consumer>{children}</PromotionContext.Consumer>;
};
