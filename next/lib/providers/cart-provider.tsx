import { createContext, useContext, useEffect, useState } from "react";
import cloneDeep from "lodash/cloneDeep";
import { useToast } from "./toast-provider";
import { Product } from "../repo/product.repo";

export const CartContext = createContext<
  Partial<{
    totalFood: number;
    totalMoney: number;
    cartProducts: CartProduct[];
    setCartProducts: Function;
    addProductToCart: Function;
    changeProductQuantity: Function;
    removeProductFromCart: Function;
  }>
>({});
export interface CartProduct {
  productId: string;
  product?: Product;
  note?: string;
  qty: number;
  price?: number;
  amount?: number;
}
export function CartProvider(props) {
  const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);
  const [totalFood, setTotalFood] = useState(0);
  const [totalMoney, setTotalMoney] = useState(0);
  useEffect(() => {
    setTotalFood(cartProducts.reduce((count, item) => (count += item.qty), 0));
    setTotalMoney(cartProducts.reduce((total, item) => (total += item.price * item.qty), 0));
    // setCartProductTotal(cartProducts.length);
  }, [cartProducts]);
  const addProductToCart = (product: Product, qty: number): boolean => {
    if (!qty) return false;
    let cartProduct = cartProducts.find((x) => x.productId == product.id);
    if (cartProduct) {
      cartProduct.qty += qty;
      cartProduct.amount = cartProduct.price * cartProduct.qty;
    } else {
      cartProducts.push({
        productId: product.id,
        product: product,
        qty,
        price: product.basePrice,
        amount: product.basePrice * qty,
      });
    }
    setCartProducts([...cartProducts]);
    return true;
  };
  const changeProductQuantity = (product: Product, qty: number) => {
    if (!qty) return;
    let cartProduct = cartProducts.find((x) => x.productId == product.id);
    if (cartProduct) {
      cartProduct.qty = qty;
      cartProduct.amount = cartProduct.price * qty;
    } else {
      cartProducts.push({
        productId: product.id,
        product: product,
        qty,
        price: product.salePrice,
        amount: product.salePrice * qty,
      });
    }
    setCartProducts([...cartProducts]);
  };
  const removeProductFromCart = (product: Product) => {
    let cartProductIndex = cartProducts.findIndex((x) => x.productId == product.id);
    if (cartProductIndex >= 0) {
      cartProducts.splice(cartProductIndex, 1);
    }
    setCartProducts([...cartProducts]);
  };
  // useEffect(() => {}, []);

  return (
    <CartContext.Provider
      value={{
        totalFood,
        totalMoney,
        cartProducts,
        setCartProducts,
        addProductToCart,
        removeProductFromCart,
        changeProductQuantity,
      }}
    >
      {props.children}
    </CartContext.Provider>
  );
}

export const useCartContext = () => useContext(CartContext);
