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
import { Product } from "../../../../lib/repo/product.repo";
import { ImgProduct } from "../../../shared/homepage-layout/img-product";
import { Rating } from "../../../shared/homepage-layout/rating";

interface Propstype extends DialogPropsType {}
export function CartDialog(props: Propstype) {
  const router = useRouter();
  const { customer, customerLogin, shopCode, shop } = useShopContext();
  const [showLogin, setShowLogin] = useState(false);
  const { cartProducts, totalMoney, changeProductQuantity, saleUpProducts } = useCartContext();
  const { isMobile } = useDevice();

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
          className={`text-sm sm:text-base v-scrollbar  px-4 ${isMobile ? "pb-12" : ""}`}
          style={{ maxHeight: `calc(96vh - 150px)`, minHeight: `calc(96vh - 350px)` }}
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
                    {cartProduct.product.selectedToppings &&
                      cartProduct.product.selectedToppings
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
              router.push(`${shopCode}/payment`, null, { shallow: true });
            } else {
              setShowLogin(true);
            }
          }}
        />
      </Dialog.Footer>
      <CustomerLoginDialog
        isOpen={showLogin}
        otp={shop.config.smsOtp}
        onClose={() => setShowLogin(false)}
        onConfirm={(val) => {
          if (val) {
            customerLogin(val);
            router.push(`${shopCode}/payment`, null, { shallow: true });
          }
        }}
      />
    </Dialog>
  );
}
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation } from "swiper/core";
import { useEffect } from "react";
import Link from "next/link";

SwiperCore.use([Navigation]);
interface SaleUpProductProps extends ReactProps {
  saleUpProduct: Product[];
}
export function SaleUpProduct(props: SaleUpProductProps) {
  const { shop } = useShopContext();
  useEffect(() => {
    console.log(props.saleUpProduct);
  }, [props.saleUpProduct]);
  return (
    <div className="relative group mt-10">
      <h3 className="text-lg font-semibold text-primary pb-2">
        {shop?.config.upsaleTitle || "Ngon hơn khi ăn kèm"}
      </h3>
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
            <Link
              key={index}
              href={{ pathname: location.pathname, query: { product: item.code } }}
              shallow
            >
              <a>
                <div
                  className={`w-full py-2 shadow-md rounded-sm hover:bg-primary-light cursor-pointer border-b transition-all duration-300 `}
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

                    <div className="relative overflow-hidden rounded-md">
                      <div className="flex">
                        <img
                          className="w-16 h-16 sm:w-24 sm:h-24 rounded-sm object-contain"
                          src={item.image || "/assets/default/default.png"}
                          alt=""
                        />
                      </div>

                      {item.saleRate > 0 && (
                        <div
                          className={`absolute  bg-danger text-white font-semibold rounded-bl-3xl py-1 px-2 text-sm -top-1 -right-1
                    `}
                        >
                          -<span className="pl-0.5">{item.saleRate}</span>%
                        </div>
                      )}
                    </div>
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
              </a>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
