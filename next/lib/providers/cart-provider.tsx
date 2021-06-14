import { createContext, useContext, useEffect, useState } from "react";
import cloneDeep from "lodash/cloneDeep";
import { useToast } from "./toast-provider";

export const CartContext = createContext<
  Partial<{
    totalFood: number;
    totalMoney: number;
    cart: Food[];
    setCart: Function;
    handleChange: Function;
  }>
>({});
export type Food = {
  qty?: number;
  name: string;
  note?: string;
  img: string;
  price: number;
  amount?: number;
};
export function CartProvider(props) {
  const toast = useToast();
  const [cart, setCart] = useState<Food[]>([]);
  const [totalFood, setTotalFood] = useState(0);
  const [totalMoney, setTotalMoney] = useState(0);
  useEffect(() => {
    setTotalFood(cart.reduce((count, item) => (count += item.qty), 0));
    setTotalMoney(cart.reduce((total, item) => (total += item.price * item.qty), 0));
    // setCartProductTotal(cartProducts.length);
  }, [cart]);
  function handleChange(index: number, food?: Food) {
    let newCart = cart;
    if (index !== -1) {
      newCart.splice(index, 1);
      toast.info("Đã xóa sản phẩm khỏi giỏ hàng");
    } else {
      let cartProduct = newCart.find((x) => x.name == food.name);
      if (cartProduct) {
        cartProduct.qty = food.qty;
        cartProduct.amount = cartProduct.price * cartProduct.qty;
      } else {
        newCart.push({
          name: food.name,
          qty: 1,
          img: "",
          price: food.price,
          amount: food.price,
        });
        toast.success("Đã thêm sản phẩm vào giỏ hàng");
      }
    }
    setCart(cloneDeep(newCart));
  }
  useEffect(() => {}, []);

  return (
    <CartContext.Provider value={{ totalFood, totalMoney, cart, setCart, handleChange }}>
      {props.children}
    </CartContext.Provider>
  );
}

export const useCartContext = () => useContext(CartContext);
