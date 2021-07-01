import RestaurantFood from "./component/restaurant-menus/restaurant-menus";
import RestaurantInformation from "./component/restaurant-information/restaurant-information";
import { useCartContext } from "../../../lib/providers/cart-provider";
import FloatingButton from "./component/cart/floating-button";
import { useEffect, useState } from "react";
import CartDialog from "./component/cart/cart-dialog";
import { useShopContext } from "../../../lib/providers/shop-provider";
import { Spinner } from "../../shared/utilities/spinner";
import { ProductDetail } from "../../shop/product-detail/detail";
import { Footer } from "../../../layouts/default-layout/components/footer";
import { ProductDetailProvider } from "../../shop/product-detail/provider/product-detail-provider";

interface PropsType extends ReactProps {
  productId?: string;
}
export function Homepage({ productId }: PropsType) {
  const { shop } = useShopContext();
  const { cart, totalFood, totalMoney, handleChange } = useCartContext();
  const [showDialogCart, setShowDialogCart] = useState(false);
  const [productIdCode, setProductIdCode] = useState(productId);
  const [openDialog, setOpenDialog] = useState(false);
  console.log(productId, productIdCode);

  useEffect(() => {
    if (productIdCode != null) setOpenDialog(true);
  }, [productIdCode]);

  useEffect(() => {
    setProductIdCode(productId);
    setOpenDialog(true);
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
        {cart && cart.length > 0 && (
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
          slideFromBottom="all"
          onChange={handleChange}
          money={totalMoney}
        />
      </div>

      <ProductDetail
        productId={productIdCode}
        isOpen={openDialog}
        onClose={() => setOpenDialog(false)}
      ></ProductDetail>

      <Footer />
    </>
  );
}
