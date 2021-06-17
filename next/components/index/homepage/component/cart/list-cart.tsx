import React from "react";
import Price from "../../../../shared/utilities/infomation/price";
import { Quantity } from "../../../../shared/utilities/infomation/quantity";
import { Food } from "../../../../../lib/providers/cart-provider";
import { useAlert } from "../../../../../lib/providers/alert-provider";
interface Propstype extends ReactProps {
  cart: Food[];
  onChange: Function;
}

const ListCart = (props: Propstype) => {
  const alert = useAlert();
  async function onChange(qty: number, index: number, item: Food) {
    if (qty > 0) {
      props.onChange(-1, { ...item, qty: qty });
    } else {
      let res = await alert.question(
        "Thông báo",
        "Bạn muốn xóa sản phẩm này khỏi giỏ hàng",
        "Xác nhận"
      );
      if (res) {
        props.onChange(index);
      }
    }
  }
  return (
    <div className="text-sm overflow-y-auto px-4" style={{ maxHeight: `calc(100vh - 250px)` }}>
      {props.cart.map((item, index) => (
        <div className="flex items-center justify-between py-1.5 border-b w-full" key={index}>
          <div className="leading-7">
            <p className="text-ellipsis">
              <span className="text-primary font-semibold">{item.qty} X </span>
              {item.name}
            </p>
            <Price price={item.price} />
            {item.note && <p className="text-gray-500 text-ellipsis">Ghi chú: {item.note}</p>}
          </div>
          <Quantity quantity={item.qty} setQuantity={(val) => onChange(val, index, item)} />
        </div>
      ))}
    </div>
  );
};

export default ListCart;
