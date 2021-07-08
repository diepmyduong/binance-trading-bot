import { createContext, useContext, useEffect, useState } from "react";
import { Product, ProductService } from "../repo/product.repo";
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
import { useRouter } from "next/router";
import { RiNurseFill } from "react-icons/ri";

export const CartContext = createContext<
  Partial<{
    draftOrder?: any;
    orderInput?: OrderInput;
    setOrderInput?: any;
    inforBuyers: any;
    setInforBuyers: any;
    totalFood: number;
    totalMoney: number;
    cartProducts: CartProduct[];
    setCartProducts: Function;
    addProductToCart: Function;
    resetOrderInput: Function;
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
  const [draftOrder, setDraftOrder] = useState<{
    invalid: boolean;
    invalidReason: string;
    order: Order;
  }>({
    invalid: true,
    invalidReason: "",
    order: null,
  });

  const { branchSelecting, customer } = useShopContext();
  const [orderInput, setOrderInput] = useState<OrderInput>({
    buyerName: "",
    buyerPhone: "",
    pickupMethod: "DELIVERY",
    shopBranchId: branchSelecting?.id,
    pickupTime: null,
    buyerAddress: "",
    buyerProvinceId: "70",
    buyerDistrictId: "",
    buyerWardId: "",
    latitude: 0,
    longitude: 0,
    paymentMethod: "COD",
    note: "",
    items: null,
  });
  console.log("ORDERINPUT", orderInput);
  const resetOrderInput = () => {
    setOrderInput({
      buyerName: "",
      buyerPhone: "",
      pickupMethod: "DELIVERY",
      shopBranchId: branchSelecting?.id,
      pickupTime: null,
      buyerAddress: "",
      buyerProvinceId: "70",
      buyerDistrictId: "",
      buyerWardId: "",
      latitude: 0,
      longitude: 0,
      paymentMethod: "COD",
      note: "",
      items: null,
    });
  };
  useEffect(() => {
    let itemProduct: OrderItemInput[] = [];
    cartProducts.forEach((item) => {
      let OrderItem: OrderItemInput = {
        productId: item.productId,
        quantity: item.qty,
        toppings: item.topping,
      };
      itemProduct.push(OrderItem);
    });
    setOrderInput({ ...orderInput, items: itemProduct });
  }, [cartProducts]);
  useEffect(() => {
    if (branchSelecting) setOrderInput({ ...orderInput, shopBranchId: branchSelecting.id });
  }, [branchSelecting]);
  useEffect(() => {
    if (customer) {
      setOrderInput({ ...orderInput, buyerName: customer.name, buyerPhone: customer.phone });
    }
  }, [customer]);
  useEffect(() => {
    let listCart = JSON.parse(localStorage.getItem("cartProducts"));
    if (listCart) {
      if (listCart) {
        ProductService.getAll({
          query: {
            limit: 0,
            filter: {
              _id: { __in: listCart.map((x) => x.productId) },
            },
          },
        }).then((res) => {
          if (res.data) {
            listCart.forEach((cartProduct) => {
              let product = res.data.find((x) => x.id === cartProduct.productId);
              let priceProduct =
                product.basePrice +
                cartProduct.topping.reduce((total, item) => (total += item.price), 0);
              if (product) {
                cartProduct.price = priceProduct;
                cartProduct.amount = priceProduct * cartProduct.qty;
                cartProduct.product = product;
              }
            });
            listCart = listCart.filter((x) => x.product);
            setCartProducts([...listCart]);
          }
        });
      }
    }
  }, []);
  const router = useRouter();
  const toast = useToast();
  useEffect(() => {
    setTotalFood(cartProducts.reduce((count, item) => (count += item.qty), 0));
    setTotalMoney(cartProducts.reduce((total, item) => (total += item.amount), 0));
    localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
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
    topping: OrderItemToppingInput[],
    note: string
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
        note: note,
      });
    }
    console.log(cartProducts);
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
    console.log(cartProducts);
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

  const generateDraftOrder = () => {
    OrderService.generateDraftOrder(orderInput)
      .then((res: any) => {
        setDraftOrder({ ...res });
      })
      .catch((err) => console.log("Loi generate", err));
  };

  const generateOrder = () => {
    if (!draftOrder.invalid) {
      return OrderService.generateOrder(orderInput)
        .then((res) => {
          toast.success("Đặt hàng thành công");
          localStorage.removeItem("cartProducts");
          setCartProducts([]);
          resetOrderInput();
          router.push("/");
        })
        .catch((err) => toast.error("Đặt hàng thất bại"));
    }
  };

  return (
    <CartContext.Provider
      value={{
        draftOrder: draftOrder,
        totalFood,
        totalMoney,
        cartProducts,
        orderInput,
        resetOrderInput,
        setOrderInput,
        generateOrder,
        generateDraftOrder,
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
