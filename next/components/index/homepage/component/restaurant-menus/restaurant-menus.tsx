import React from "react";
import Menus from "./menus";
import MustTryMenu from "./must-try-menu";
interface PropsType extends ReactProps {}

const RestaurantMenus = (props: PropsType) => {
  return (
    <div className="bg-white mt-4 mb-10">
      <MustTryMenu />
      <Menus />
    </div>
  );
};

export default RestaurantMenus;
