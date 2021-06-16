import RestaurantFood from "./component/restaurant-menus/restaurant-menus";
import RestaurantInformation from "./component/restaurant-information/restaurant-information";
import { useCartContext } from "../../../lib/providers/cart-provider";
import FloatingButton from "./component/cart/floating-button";
import { useEffect, useState } from "react";
import CartDialog from "./component/cart/cart-dialog";

export function Homepage() {
  const { cart, totalFood, totalMoney, handleChange } = useCartContext();
  const [showDialogCart, setShowDialogCart] = useState(false);
  useEffect(() => {
    if (totalFood === 0) {
      setShowDialogCart(false);
    }
  }, [totalFood]);
  return (
    <div className="z-0 bg-white text-gray-800">
      <RestaurantInformation />
      <RestaurantFood />
      {cart && cart.length && (
        <FloatingButton
          totalFood={totalFood}
          totalMoney={totalMoney}
          onClick={() => setShowDialogCart(true)}
        />
      )}
      <CartDialog
        isOpen={showDialogCart}
        onClose={() => setShowDialogCart(false)}
        cart={cart}
        onChange={handleChange}
        money={totalMoney}
      />
    </div>
  );
}
