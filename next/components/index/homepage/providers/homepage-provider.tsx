import { createContext, useContext, useEffect, useState } from "react";
import { ShopVoucher, ShopVoucherService } from "../../../../lib/repo/shop-voucher.repo";
import cloneDeep from "lodash/cloneDeep";

export const HomeContext = createContext<Partial<{ voucherShow: ShopVoucher }>>({});

export function HomeProvider(props) {
  const [voucherShow, setVoucherShow] = useState<ShopVoucher>(null);
  useEffect(() => {
    ShopVoucherService.getAll({ query: { limit: 1 } }).then((res) =>
      setVoucherShow(cloneDeep(res.data[0]))
    );
  }, []);
  return <HomeContext.Provider value={{ voucherShow }}>{props.children}</HomeContext.Provider>;
}

export const useHomeContext = () => useContext(HomeContext);

export const HomeConsumer = ({
  children,
}: {
  children: (props: Partial<{ voucherShow: ShopVoucher }>) => any;
}) => {
  return <HomeContext.Consumer>{children}</HomeContext.Consumer>;
};
