import RestaurantFood from "./component/restaurant-menus/restaurant-menus";
import RestaurantInformation from "./component/restaurant-information/restaurant-information";
import { useCartContext } from "../../../lib/providers/cart-provider";
import FloatingButton from "./component/cart/floating-button";
import { useEffect, useState } from "react";
import CartDialog from "./component/cart/cart-dialog";
import { useShopContext } from "../../../lib/providers/shop-provider";
import { Spinner } from "../../shared/utilities/spinner";
import { Form } from "../../shared/utilities/form/form";
import { RestaurantDetail } from "./component/restaurant-detail/detail";
import { Footer } from "../../../layouts/default-layout/components/footer";

interface PropsType extends ReactProps {
  productId?: string;
}
export function Homepage({ productId }: PropsType) {
  const { shop } = useShopContext();
  const {
    cartProducts,
    totalFood,
    totalMoney,
    changeProductQuantity,
    removeProductFromCart,
  } = useCartContext();
  const [showDialogCart, setShowDialogCart] = useState(false);
  const [productIdCode, setProductIdCode] = useState(productId);
  const [openDialog, setOpenDialog] = useState(false);
  console.log(productId, productIdCode);

  useEffect(() => {
    if (productIdCode != null) setOpenDialog(true);
  }, [productIdCode]);

  useEffect(() => {
    setProductIdCode(productId);
  }, [productId]);

  useEffect(() => {
    if (totalFood === 0) {
      setShowDialogCart(false);
    }
  }, [totalFood]);
  return (
    <>
      <div className={`z-0 relative bg-white min-h-screen text-gray-800`}>
        {!shop ? (
          <Spinner />
        ) : (
          <>
            <RestaurantInformation shop={shop} />
            <RestaurantFood />
          </>
        )}
        {cartProducts && cartProducts.length > 0 && (
          <FloatingButton
            totalFood={totalFood}
            totalMoney={totalMoney}
            onClick={() => setShowDialogCart(true)}
          />
        )}
        <CartDialog
          isOpen={showDialogCart}
          onClose={() => setShowDialogCart(false)}
          cart={cartProducts}
          slideFromBottom="all"
          money={totalMoney}
          onChange={changeProductQuantity}
          onRemove={removeProductFromCart}
        />
      </div>
      <Footer />
    </>
  );
}
