import { useCartContext } from "../../../lib/providers/cart-provider";
import React, { useEffect, useState } from "react";
import { useShopContext } from "../../../lib/providers/shop-provider";
import { Spinner } from "../../shared/utilities/spinner";
import { Footer } from "../../../layouts/default-layout/components/footer";
import { ShopCategories } from "./components/shop-categories";
import { CartDialog } from "./components/cart-dialog";
import { NumberPipe } from "../../../lib/pipes/number";
import { ShopInfo } from "./components/shop-info";
import { ProductDetail } from "../../shop/product-detail/detail";

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
    if (productIdCode) setOpenDialog(true);
  }, [productIdCode]);

  useEffect(() => {
    setProductIdCode(productId);
    if (productId) setOpenDialog(true);
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
            <ShopInfo shop={shop} />
            <ShopCategories />
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
      <ProductDetail
        productId={productId}
        isOpen={openDialog}
        onClose={() => setOpenDialog(false)}
      ></ProductDetail>

      <Footer />
    </>
  );
}
interface FloatButtonProps extends ReactProps {
  totalFood: string | number;
  totalMoney: string | number;
  onClick?: Function;
}

const FloatingButton = (props: FloatButtonProps) => {
  return (
    <div className="w-full mt-3 sticky bottom-5 sm:bottom-7 left-0 flex flex-col items-center z-100">
      <div className="max-w-lg flex flex-col items-center w-full px-4">
        <button
          className={`z-50 flex text-sm btn-primary mx-4 w-full max-w-sm sm:h-14`}
          onClick={() => props.onClick()}
        >
          <span className="flex-1">Giỏ hàng</span>
          <span className="flex-1 text-right whitespace-nowrap pl-4">
            {props.totalFood} món - {NumberPipe(props.totalMoney, true)}
          </span>
        </button>
      </div>
    </div>
  );
};
