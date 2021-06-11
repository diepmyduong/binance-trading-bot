import React from "react";
import Menus from "./menus";
import MustTryMenu from "./must-try-menu";

const RestaurantMenus = () => {
  return (
    <div className="bg-white mt-4">
      <MustTryMenu />
      <Menus />
    </div>
  );
};

export default RestaurantMenus;
