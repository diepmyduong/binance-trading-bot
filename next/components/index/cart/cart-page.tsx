import React, { useState } from "react";
import ListCart from "./components/list-cart";
import Price from "../../shared/utilities/infomation/price";
import { Button } from "../../shared/utilities/form/button";
import cloneDeep from "lodash/cloneDeep";

const CartPage = () => {
  const list = [
    {
      qty: 1,
      name: "Cơm tấm sườn Ốp la",
      note: "Nước mắm nhiều ớt",
      img: "",
      price: 119000,
    },
    {
      qty: 1,
      name: "Cơm tấm sườn Ốp la",
      note: "Nước mắm nhiều ớt",
      img: "",
      price: 119000,
    },
    {
      qty: 1,
      name: "Cơm tấm sườn Ốp la",
      note: "Nước mắm nhiều ớt",
      img: "",
      price: 119000,
    },
    {
      qty: 1,
      name: "Cơm tấm sườn Ốp la",
      note: "Nước mắm nhiều ớt",
      img: "",
      price: 119000,
    },
    {
      qty: 1,
      name: "Cơm tấm sườn Ốp la",
      img: "",
      price: 119000,
    },
  ];
  const [cart, setCart] = useState(list);
  function handleRemoveItem(index: number) {
    let newCart = cart;
    newCart.splice(index, 1);
    setCart(cloneDeep(newCart));
  }
  return (
    <div className="bg-white min-h-screen">
      <ListCart cart={cart} onRemove={handleRemoveItem} />
      <div className="flex fixed bottom-0 left-0 w-full p-2 bg-white">
        <div className="flex-1">
          <p>Số lượng: {cart.length} món</p>
          <Price price={182000} />
        </div>
        <Button className="flex-1" text="Thanh toán" primary large />
      </div>
    </div>
  );
};

export default CartPage;
