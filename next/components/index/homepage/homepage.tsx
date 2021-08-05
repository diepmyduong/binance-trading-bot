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
import { HomeProvider, HomeConsumer } from "./providers/homepage-provider";
import { forceCheck } from "react-lazyload";
import { AddressGongDialog } from "../customer/components/address-gong-dialog";

function ShopHeader() {
  return (
    <div>
      <ShopInfo />
      <ShopCategories />
    </div>
  );
}

function CartButton() {
  const { cartProducts, totalFood, totalMoney } = useCartContext();
  const [showDialogCart, setShowDialogCart] = useState(false);
  if (!cartProducts || !cartProducts.length) return <></>;
  return (
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
  );
}

export function Homepage() {
  const {
    shop,
    showGongAddress,
    setLocationCustomer,
    locationCustomer,
    setShowGongAddress,
  } = useShopContext();
  const router = useRouter();
  const { product } = router.query;
  console.log("shop home page", shop);
  if (!shop) return <Spinner />;
  return (
    <HomeProvider>
      <div className={`z-0 relative bg-white min-h-screen text-gray-800`}>
        <ShopHeader></ShopHeader>
        <CartButton></CartButton>
      </div>
      <ProductDetailProvider productCode={product}>
        <ProductDetail
          isOpen={!!product}
          onClose={() => {
            const url = new URL(location.href);
            url.searchParams.delete("product");
            router.push(url.toString(), null, { shallow: true });
          }}
        />
      </ProductDetailProvider>
      <Footer />
      <AddressGongDialog
        slideFromBottom="all"
        title="Nhập địa chỉ"
        mobileSizeMode
        isOpen={showGongAddress}
        fullAddress={locationCustomer?.fullAddress}
        onClose={() => setShowGongAddress(false)}
        onChange={(data) => {
          if (data.fullAddress) {
            setLocationCustomer({
              fullAddress: data.fullAddress,
              lat: data.lat,
              lg: data.lg,
            });
          }
        }}
      />
    </HomeProvider>
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
      onClick={() => {
        setTimeout(() => forceCheck(), 200);
        props.onClick();
      }}
    >
      <span>Giỏ hàng</span>
      <span className="text-right whitespace-nowrap pl-4">
        {props.totalFood} món - {NumberPipe(props.totalMoney, true)}
      </span>
    </button>
    // </div>
  );
};
