import { createContext, useContext, useEffect, useState } from "react";
import { ShopVoucher, ShopVoucherService } from "../../../../lib/repo/shop-voucher.repo";
import cloneDeep from "lodash/cloneDeep";
import { PaginationQueryProps, usePaginationQuery } from "../../../../lib/hooks/usePaginationQuery";
import { Category, CategoryService } from "../../../../lib/repo/category.repo";

export const HomeContext = createContext<
  Partial<{ voucherShow: ShopVoucher; categoryContext: PaginationQueryProps<Category> }>
>({});

export function HomeProvider(props) {
  const [voucherShow, setVoucherShow] = useState<ShopVoucher>(null);
  const categoryContext = usePaginationQuery<Category>(
    CategoryService,
    null,
    {
      order: { priority: -1, createdAt: 1 },
    },
    CategoryService.fullFragment
  );
  useEffect(() => {
    ShopVoucherService.getAll({ query: { limit: 1 } }).then((res) =>
      setVoucherShow(cloneDeep(res.data[0]))
    );
  }, []);
  return (
    <HomeContext.Provider value={{ voucherShow, categoryContext }}>
      {props.children}
    </HomeContext.Provider>
  );
}

export const useHomeContext = () => useContext(HomeContext);

export const HomeConsumer = ({
  children,
}: {
  children: (props: Partial<{ voucherShow: ShopVoucher }>) => any;
}) => {
  return <HomeContext.Consumer>{children}</HomeContext.Consumer>;
};
