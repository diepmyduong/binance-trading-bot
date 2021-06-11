import React, { useEffect, useState } from "react";
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
  const [totalFood, setTotalFood] = useState(0);
  const [totalMoney, setTotalMoney] = useState(0);
  useEffect(() => {
    setTotalFood(cart.reduce((count, item) => (count += item.qty), 0));
    setTotalMoney(cart.reduce((total, item) => (total += item.price * item.qty), 0));
    // setCartProductTotal(cartProducts.length);
  }, [cart]);
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
          <p>Số lượng: {totalFood} món</p>
          <Price price={totalMoney} />
        </div>
        <Button className="flex-1" text="Thanh toán" primary large />
      </div>
    </div>
  );
};

export default CartPage;
