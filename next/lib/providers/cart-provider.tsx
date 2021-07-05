import { createContext, useContext, useEffect, useState } from "react";
import cloneDeep from "lodash/cloneDeep";
import { useToast } from "./toast-provider";
import { Product } from "../repo/product.repo";
import { OrderItemToppingInput, ToppingOption } from "../repo/product-topping.repo";
import { OrderInput, OrderItemInput, OrderService } from "../repo/order.repo";

export const CartContext = createContext<
  Partial<{
    totalFood: number;
    totalMoney: number;
    cartProducts: CartProduct[];
    setCartProducts: Function;
    addProductToCart: Function;
    generateOrder: Function;
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
  topping?: ToppingOption[];
}
export function CartProvider(props) {
  const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);
  const [totalFood, setTotalFood] = useState(0);
  const [totalMoney, setTotalMoney] = useState(0);
  useEffect(() => {
    setTotalFood(cartProducts.reduce((count, item) => (count += item.qty), 0));
    setTotalMoney(cartProducts.reduce((total, item) => (total += item.amount), 0));
  }, [cartProducts]);
  const addProductToCart = (product: Product, qty: number, topping: ToppingOption[]): boolean => {
    if (!qty) return false;
    let cartProduct = cartProducts.find((x) => x.productId == product.id);
    let totalTopping = 0;

    if (cartProduct) {
      cartProduct.qty += qty;
      cartProduct.amount = cartProduct.price * cartProduct.qty;
    } else {
      cartProducts.push({
        productId: product.id,
        product: product,
        qty,
        price: product.downPrice,
        amount: product.downPrice * qty + topping.reduce((total, item) => (total += item.price), 0),
        topping: topping,
      });
    }
    setCartProducts([...cartProducts]);
    return true;
  };
  const changeProductQuantity = (product: Product, qty: number, topping: ToppingOption[]) => {
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
        topping: [],
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

  const generateOrder = () => {
    let itemProduct: OrderItemInput[] = [{ productId: "", quantity: 1, toppings: null }];
    cartProducts.forEach((item) => {
      let toppingInput: OrderItemToppingInput[] = [];
      item.topping.forEach((it) => {
        let temp: OrderItemToppingInput;
        temp = {
          optionName: it.name,
          toppingName: it.name,
          price: it.price,
          toppingId: it.name,
        };
        toppingInput.push(temp);
      });
      let OrderItem: OrderItemInput = {
        productId: item.productId,
        quantity: item.qty,
        toppings: null,
      };
      itemProduct.push(OrderItem);
    });
    let data: OrderInput = {
      buyerName: "abc",
      buyerPhong: "abc",
      pickupMethod: "abc",
      shopBranchId: "abc",
      pickupTime: "abc",
      buyerProvinceId: "abc",
      buyerDistrictId: "abc",
      buyerWardId: "abc",
      latitude: 0,
      longtitude: 0,
      paymentMethod: "abc",
      note: "abc",
      items: [{ productId: "60de971963334fc458de4886", quantity: 1, toppings: null }],
    };
    OrderService.generateOrder(data)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log("Loi generate", err));
  };

  return (
    <CartContext.Provider
      value={{
        totalFood,
        totalMoney,
        cartProducts,
        generateOrder,
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
