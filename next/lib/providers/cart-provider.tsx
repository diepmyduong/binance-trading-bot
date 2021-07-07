import { createContext, useContext, useEffect, useState } from "react";
import { Product } from "../repo/product.repo";
import { OrderItemToppingInput, ToppingOption } from "../repo/product-topping.repo";
import {
  CreateOrderInput,
  Order,
  OrderInput,
  OrderItemInput,
  OrderService,
} from "../repo/order.repo";
import { useShopContext } from "./shop-provider";
import { useToast } from "./toast-provider";
import { PickupTypes } from "../../../src/helpers/vietnamPost/resources/type";

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
    generateOrder: () => any;
    generateDraftOrder: Function;
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
  const [itemProducts, setItemProducts] = useState<OrderItemInput[]>();
  const [order, setOrder] = useState<any>({ invalid: true, invalidReason: "", order: null });
  const [note, setNote] = useState({ note: "" });
  const { branchSelecting } = useShopContext();
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
  const getPhone = () => {
    if (typeof window === "undefined") return;
    return localStorage.getItem("phoneUser");
  };
  const toast = useToast();
  // useEffect(() => {
  //   generateOrder(inforBuyers, "");
  // }, []);
  useEffect(() => {
    setTotalFood(cartProducts.reduce((count, item) => (count += item.qty), 0));
    setTotalMoney(cartProducts.reduce((total, item) => (total += item.amount), 0));
  }, [cartProducts]);
  function checkInCart(
    product: Product,
    topping: OrderItemToppingInput[],
    cartProduct: CartProduct
  ): boolean {
    if (cartProduct && JSON.stringify(cartProduct.topping) == JSON.stringify(topping)) {
      return true;
    }
    return false;
  }
  const addProductToCart = (
    product: Product,
    qty: number,
    topping: OrderItemToppingInput[]
  ): boolean => {
    if (!qty) return false;
    let cartProduct = cartProducts.find(
      (x) => x.productId == product.id && checkInCart(product, topping, x)
    );
    if (cartProduct) {
      cartProduct.qty += qty;
      cartProduct.amount = cartProduct.price * cartProduct.qty;
    } else {
      let priceProduct =
        product.basePrice + topping.reduce((total, item) => (total += item.price), 0);
      cartProducts.push({
        productId: product.id,
        product: product,
        qty,
        price: priceProduct,
        amount: priceProduct * qty,
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
    let cartProduct = cartProducts.find(
      (x) => x.productId == product.id && checkInCart(product, topping, x)
    );
    if (cartProduct) {
      cartProduct.qty = qty;
      cartProduct.amount = cartProduct.price * qty;
    } else {
      let priceProduct =
        product.basePrice + topping.reduce((total, item) => (total += item.price), 0);
      cartProducts.push({
        productId: product.id,
        product: product,
        qty,
        price: priceProduct,
        amount: priceProduct * qty,
        topping: topping,
      });
    }
    setCartProducts([...cartProducts]);
  };
  const removeProductFromCart = (product: Product, topping: OrderItemToppingInput[]) => {
    let cartProductIndex = cartProducts.findIndex(
      (x) => x.productId == product.id && checkInCart(product, topping, x)
    );
    if (cartProductIndex >= 0) {
      cartProducts.splice(cartProductIndex, 1);
    }
    setCartProducts([...cartProducts]);
  };

  const generateDraftOrder = (inforBuyer, note) => {
    if (!inforBuyer) return;
    setInforBuyers({ ...inforBuyer });
    setNote({ ...note });
    let itemProduct: OrderItemInput[] = [];

    cartProducts.forEach((item) => {
      let OrderItem: OrderItemInput = {
        productId: item.productId,
        quantity: item.qty,
        toppings: item.topping,
      };
      itemProduct.push(OrderItem);
    });
    setItemProducts(itemProduct);
    let longtitude = 106.70788626891724,
      lattitude = 10.795957687020659;
    console.log("inforBuyerinforBuyer", inforBuyer);
    let data: OrderInput = {
      buyerName: inforBuyer.name,
      buyerPhone: inforBuyer.phone || getPhone(),
      pickupMethod: "DELIVERY",
      shopBranchId: branchSelecting?.id,
      pickupTime: null,
      buyerAddress: inforBuyer.address?.address,
      buyerProvinceId: inforBuyer.address?.provinceId,
      buyerDistrictId: inforBuyer.address?.districtId,
      buyerWardId: inforBuyer.address?.wardId,
      latitude: lattitude,
      longitude: longtitude,
      paymentMethod: "COD",
      note: note.note,
      items: itemProduct,
    };
    OrderService.generateDraftOrder(data)
      .then((res) => {
        setOrder({ ...res });
      })
      .catch((err) => console.log("Loi generate", err));
  };

  const generateOrder = () => {
    let longtitude = 106.70788626891724,
      lattitude = 10.795957687020659;
    let data: OrderInput = {
      buyerName: inforBuyers.name,
      buyerPhone: inforBuyers.phone || getPhone(),
      pickupMethod: "DELIVERY",
      shopBranchId: branchSelecting?.id,
      pickupTime: null,
      buyerAddress: inforBuyers.address?.address,
      buyerProvinceId: inforBuyers.address?.provinceId,
      buyerDistrictId: inforBuyers.address?.districtId,
      buyerWardId: inforBuyers.address?.wardId,
      latitude: lattitude,
      longitude: longtitude,
      paymentMethod: "COD",
      note: note.note,
      items: itemProducts,
    };
    if (!order.invalid) {
      return OrderService.generateOrder(data)
        .then((res) => {
          toast.success("Đặt hàng thành công");
        })
        .catch((err) => toast.error("Đặt hàng thất bại"));
    }
  };

  return (
    <CartContext.Provider
      value={{
        order,
        totalFood,
        totalMoney,
        cartProducts,
        inforBuyers,
        generateOrder,
        generateDraftOrder,
        setInforBuyers,
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
