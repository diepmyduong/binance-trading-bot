import React, { useState } from "react";
import { useCartContext } from "../../../../lib/providers/cart-provider";
import { Dialog, DialogPropsType } from "../../../shared/utilities/dialog/dialog";
import { Button } from "../../../shared/utilities/form/button";
import { NumberPipe } from "../../../../lib/pipes/number";
import { CustomerLoginDialog } from "../../../shared/homepage-layout/customer-login-dialog";
import { useShopContext } from "../../../../lib/providers/shop-provider";
import { useRouter } from "next/router";
import { Price } from "../../../shared/homepage-layout/price";
import { Quantity } from "../../../shared/homepage-layout/quantity";
import useDevice from "../../../../lib/hooks/useDevice";
import { Product, ProductService } from "../../../../lib/repo/product.repo";
import { ImgProduct } from "../../../shared/homepage-layout/img-product";
import { Rating } from "../../../shared/homepage-layout/rating";

interface Propstype extends DialogPropsType {}
export function CartDialog(props: Propstype) {
  const router = useRouter();
  const { customer, customerLogin } = useShopContext();
  const [showLogin, setShowLogin] = useState(false);
  const { cartProducts, totalMoney, changeProductQuantity } = useCartContext();
  const { isMobile } = useDevice();
  const [saleUpProducts, setSaleUpProducts] = useState<Product[]>([]);

  useEffect(() => {
    let upSalePros = saleUpProducts;
    cartProducts.forEach((cart) => {
      let upSale = cart.product.upsaleProducts;
      if (upSale && upSale.length > 0) {
        upSale.forEach((product) => {
          let index = upSalePros.findIndex((p) => p.id === product.id);
          if (index === -1) {
            ProductService.getOne({ id: product.id }).then((res) => {
              upSalePros.push(res);
              setSaleUpProducts(cloneDeep(upSalePros));
            });
          }
        });
      }
    });
  }, [cartProducts]);

  return (
    <Dialog
      isOpen={props.isOpen}
      onClose={props.onClose}
      title={"Giỏ hàng của bạn"}
      mobileSizeMode
      bodyClass="relative bg-white rounded"
      slideFromBottom="all"
      extraFooterClass="border-t border-gray-300 z-40"
      extraHeaderClass="text-lg"
    >
      <Dialog.Body>
        <div
          className={`text-sm sm:text-base px-4 ${isMobile ? "pb-12" : ""}`}
          style={{ minHeight: `calc(100vh - 350px)` }}
        >
          {cartProducts.map((cartProduct, index) => (
            <div key={index} className=" py-1.5 border-b ">
              <div className="flex items-center justify-between w-full">
                <div className="leading-7 flex-1 text-gray-700">
                  <div className="font-semibold">
                    <span className="text-primary">x{cartProduct.qty}</span>{" "}
                    {cartProduct.product.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {cartProduct.product.selectedToppings
                      .map((topping) => topping.optionName)
                      .join(", ")}
                  </div>
                  <div className="">
                    <span className="font-semibold">{NumberPipe(cartProduct.amount, true)}</span>
                  </div>
                </div>
                <Quantity
                  quantity={cartProduct.qty}
                  setQuantity={(qty) => changeProductQuantity(index, qty)}
                />
              </div>
              {cartProduct.note && (
                <div className="text-gray-500 text-ellipsis">Ghi chú: {cartProduct.note}</div>
              )}
            </div>
          ))}
          {saleUpProducts.length > 0 && <SaleUpProduct saleUpProduct={saleUpProducts} />}
        </div>
      </Dialog.Body>
      <Dialog.Footer>
        <Button
          primary
          text={`Đặt hàng ${NumberPipe(totalMoney, true)}`}
          className="w-full bg-gradient uppercase h-12 z-40"
          onClick={() => {
            if (customer) {
              router.push("/payment");
            } else {
              setShowLogin(true);
            }
          }}
        />
      </Dialog.Footer>
      <CustomerLoginDialog
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onConfirm={(val) => {
          if (val) {
            customerLogin(val);
            router.push("/payment", null, { shallow: true });
          }
        }}
      />
    </Dialog>
  );
}
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation } from "swiper/core";
import { useEffect } from "react";
import cloneDeep from "lodash/cloneDeep";

SwiperCore.use([Navigation]);
interface SaleUpProductProps extends ReactProps {
  saleUpProduct: Product[];
}
export function SaleUpProduct(props: SaleUpProductProps) {
  const router = useRouter();
  const query = router.query;
  const url = new URL(location.href);
  const handleClick = (code) => {
    url.searchParams.set("productId", code);
    router.push(url.toString(), null, { shallow: true });
  };
  return (
    <div className="relative group mt-10">
      <h3 className="text-lg font-semibold text-primary pb-2">Ngon hơn khi ăn kèm</h3>
      <Swiper
        spaceBetween={10}
        freeMode={true}
        grabCursor
        slidesPerView={"auto"}
        className="w-auto"
        navigation
      >
        {props.saleUpProduct.map((item: Product, index: number) => (
          <SwiperSlide key={index} className="w-3/4">
            <div
              className={`w-full py-2 shadow-md rounded-sm hover:bg-primary-light cursor-pointer border-b transition-all duration-300  ${
                item.allowSale ? "" : "hidden"
              }`}
              onClick={() => {
                handleClick(item.code);
              }}
            >
              <div className={`flex items-center px-4 flex-1 `}>
                <div className="flex-1 flex flex-col h-20 sm:h-24">
                  <p className="font-semibold items-start text-ellipsis w-full">{item.name}</p>
                  <p className="text-gray-500 text-sm text-ellipsis">{item.subtitle}</p>
                  <Rating rating={item.rating || 4.8} textSm soldQty={item.soldQty} />
                  <p className="text-gray-400 text-sm">{item.des}</p>
                  <Price
                    price={item.basePrice}
                    downPrice={item.downPrice}
                    textDanger
                    className="justify-items-end"
                  />
                </div>
                <ImgProduct
                  native
                  src={item.image || ""}
                  className="w-16 sm:w-24 rounded-sm h-16 sm:h-24"
                  saleRate={item.saleRate}
                />
              </div>
              {item.labels?.map((label, index) => (
                <div
                  className="ml-2 inline-flex items-center text-white rounded-full font-semibold text-xs px-2 py-1 cursor-pointer whitespace-nowrap"
                  style={{ backgroundColor: label.color }}
                  key={index}
                >
                  <span>{label.name}</span>
                </div>
              ))}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
