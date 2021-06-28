import React from "react";
import { useShopContext } from "../../../../../lib/providers/shop-provider";
import Menus from "./menus";
import MustTryMenu from "./must-try-menu";
interface PropsType extends ReactProps {}

const RestaurantMenus = (props: PropsType) => {
  const { productShop } = useShopContext();

  return (
    <div className="bg-white mt-4">
      <MustTryMenu />
      {productShop && <Menus cats={productShop} />}
    </div>
  );
};

export default RestaurantMenus;
