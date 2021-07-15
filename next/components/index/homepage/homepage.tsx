import { useCartContext } from "../../../lib/providers/cart-provider";
import React, { useEffect, useState } from "react";
import { useShopContext } from "../../../lib/providers/shop-provider";
import { Spinner } from "../../shared/utilities/spinner";
import { Footer } from "../../../layouts/default-layout/components/footer";
import { ShopCategories } from "./components/shop-categories";
import { CartDialog } from "./components/cart-dialog";
import { NumberPipe } from "../../../lib/pipes/number";
import { ShopInfo } from "./components/shop-info";
import { useRouter } from "next/router";
import { ProductDetail } from "../../shared/product-detail/detail";
import { ProductDetailProvider } from "../../shared/product-detail/provider/product-detail-provider";

export function Homepage() {
  const { shop } = useShopContext();
  const router = useRouter();
  const { productId } = router.query;
  const { cartProducts, totalFood, totalMoney } = useCartContext();
  const [showDialogCart, setShowDialogCart] = useState(false);

  return (
    <>
      <div className={`z-0 relative bg-white min-h-screen text-gray-800`}>
        {!shop ? (
          <Spinner />
        ) : (
          <>
            <ShopInfo />
            <ShopCategories />
          </>
        )}
        {!!cartProducts?.length && (
          <>
            <FloatingButton
              totalFood={totalFood}
              totalMoney={totalMoney}
              onClick={() => setShowDialogCart(true)}
            />
            <CartDialog
              isOpen={showDialogCart && !!cartProducts.length}
              onClose={() => setShowDialogCart(false)}
              slideFromBottom="all"
            />
          </>
        )}
      </div>
      <ProductDetailProvider productCode={productId}>
        <ProductDetail
          isOpen={!!productId}
          onClose={() => {
            const url = new URL(location.href);
            url.searchParams.delete("productId");
            router.push(url.toString(), null, { shallow: true });
          }}
        />
      </ProductDetailProvider>
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
    // <div className="w-full mt-3 sticky bottom-5 sm:bottom-7 left-0 flex flex-col items-center z-100">
    <button
      className={`mt-4 mb-2 sticky md:bottom-6 bottom-7 z-50 justify-between shadow-lg flex btn-primary bg-gradient mx-auto w-11/12 sm:w-5/6 max-w-md h-12 sm:h-14 animate-emerge`}
      onClick={() => props.onClick()}
    >
      <span>Giỏ hàng</span>
      <span className="text-right whitespace-nowrap pl-4">
        {props.totalFood} món - {NumberPipe(props.totalMoney, true)}
      </span>
    </button>
    // </div>
  );
};
