import React from "react";
import Price from "../../../../shared/infomation/price";
import { Quantity } from "../../../../shared/infomation/quantity";
import { CartProduct } from "../../../../../lib/providers/cart-provider";
interface Propstype extends ReactProps {
  cart: CartProduct[];
  onChange: Function;
  onRemove: Function;
}

const ListCart = (props: Propstype) => {
  async function onChange(qty: number, item: CartProduct) {
    console.log(qty);
    if (qty > 0) {
      props.onChange(item.product, qty);
    } else {
      props.onRemove(item.product);
    }
  }
  return (
    <div
      className="text-sm overflow-y-auto main-container"
      style={{ maxHeight: `calc(100vh - 250px)`, minHeight: `calc(100vh - 350px)` }}
    >
      {props.cart.map((item, index) => (
        <div className="flex items-center justify-between py-1.5 border-b w-full" key={index}>
          <div className="leading-7">
            <p className="text-ellipsis">
              <span className="text-primary font-semibold">{item.qty} X </span>
              {item.product.name}
            </p>
            <Price price={item.price} />
            {item.note && <p className="text-gray-500 text-ellipsis">Ghi chú: {item.note}</p>}
          </div>
          <Quantity quantity={item.qty} setQuantity={(val) => onChange(val, item)} />
        </div>
      ))}
    </div>
  );
};

export default ListCart;
