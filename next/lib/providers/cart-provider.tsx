import { createContext, useContext, useEffect, useState } from "react";
import { Product } from "../repo/product.repo";
import { OrderItemToppingInput, ToppingOption } from "../repo/product-topping.repo";
import { Order, OrderInput, OrderItemInput, OrderService } from "../repo/order.repo";

export const CartContext = createContext<
  Partial<{
    order?: Order;
    inforBuyers: any;
    setInforBuyers: any;
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
  topping?: OrderItemToppingInput[];
}
export function CartProvider(props) {
  const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);
  const [totalFood, setTotalFood] = useState(0);
  const [totalMoney, setTotalMoney] = useState(0);
  const [order, setOrder] = useState<any>({ invalid: true, invalidReason: "", order: null });
  const [inforBuyers, setInforBuyers] = useState({
    name: "",
    phone: "",
    address: {
      provinceId: "",
      districtId: "",
      wardId: "",
      address: "",
    },
  });
  console.log("inforBuyers", inforBuyers);
  useEffect(() => {
    generateOrder(inforBuyers, "");
  }, []);

  useEffect(() => {
    setTotalFood(cartProducts.reduce((count, item) => (count += item.qty), 0));
    setTotalMoney(cartProducts.reduce((total, item) => (total += item.amount), 0));
  }, [cartProducts]);
  const addProductToCart = (
    product: Product,
    qty: number,
    topping: OrderItemToppingInput[]
  ): boolean => {
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
        price: product.downPrice,
        amount: product.downPrice * qty + topping.reduce((total, item) => (total += item.price), 0),
        topping: topping,
      });
    }
    setCartProducts([...cartProducts]);
    return true;
  };
  const changeProductQuantity = (
    product: Product,
    qty: number,
    topping: OrderItemToppingInput[]
  ) => {
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
        topping: topping,
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

  const generateOrder = (inforBuyer, note) => {
    if (!inforBuyer) return;
    let itemProduct: OrderItemInput[] = [];
    cartProducts.forEach((item) => {
      let OrderItem: OrderItemInput = {
        productId: item.productId,
        quantity: item.qty,
        toppings: item.topping,
      };
      itemProduct.push(OrderItem);
    });
    let longtitude = 106.771436,
      lattitude = 10.842888;
    console.log("inforBuyerinforBuyer", inforBuyer);
    let data: OrderInput = {
      buyerName: "inforBuyer.name",
      buyerPhone: "inforBuyer.phone",
      pickupMethod: "abc",
      shopBranchId: "abc",
      pickupTime: "abc",
      buyerProvinceId: "inforBuyer.address.provinceId",
      buyerDistrictId: "inforBuyer.address.districtId",
      buyerWardId: "inforBuyer.address.wardId",
      latitude: lattitude,
      longitude: longtitude,
      paymentMethod: "COD",
      note: note.note,
      items: itemProduct,
    };
    OrderService.generateOrder(data)
      .then((res) => {
        setOrder(res);
      })
      .catch((err) => console.log("Loi generate", err));
  };

  return (
    <CartContext.Provider
      value={{
        order,
        totalFood,
        totalMoney,
        cartProducts,
        inforBuyers,
        setInforBuyers,
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
