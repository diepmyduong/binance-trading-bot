import { createContext, useContext, useEffect, useState } from "react";
import { Product, ProductService } from "../repo/product.repo";
import { OrderItemToppingInput, ToppingOption } from "../repo/product-topping.repo";
import cloneDeep from "lodash/cloneDeep";
import { Order, OrderInput, OrderItemInput, OrderService } from "../repo/order.repo";
import { useShopContext } from "./shop-provider";
import { useToast } from "./toast-provider";
import { useRouter } from "next/router";

export const CartContext = createContext<
  Partial<{
    draftOrder?: any;
    orderInput?: OrderInput;
    setOrderInput?: (val: OrderInput) => any;
    inforBuyers: any;
    setInforBuyers: any;
    totalFood: number;
    totalMoney: number;
    cartProducts: CartProduct[];
    resetOrderInput: Function;
    generateOrder: () => any;
    generateDraftOrder: Function;
    addProductToCart: (product: Product, qty: number, note: string) => any;
    changeProductQuantity: (productIndex: number, qty: number) => any;
    removeProductFromCart: (productIndex: number) => any;
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
  const [draftOrder, setDraftOrder] = useState<{
    invalid: boolean;
    invalidReason: string;
    order: Order;
  }>({
    invalid: true,
    invalidReason: "",
    order: null,
  });

  const { branchSelecting, customer, locationCustomer } = useShopContext();
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
    buyerFullAddress: "",
    buyerAddressNote: "",
    latitude: 10.72883,
    longitude: 106.725484,
    paymentMethod: "COD",
    note: "",
  });
  const resetOrderInput = () => {
    setOrderInput({
      ...orderInput,
      pickupMethod: "DELIVERY",
      pickupTime: null,
      buyerAddress: "",
      buyerProvinceId: "70",
      buyerDistrictId: "",
      buyerWardId: "",
      note: "",
      paymentMethod: "COD",
    });
  };
  const router = useRouter();
  const toast = useToast();
  const getItemsOrderInput = () => {
    let itemProduct: OrderItemInput[] = [];
    console.log("cartProducts", cartProducts);
    cartProducts.forEach((cartProduct) => {
      let OrderItem: OrderItemInput = {
        productId: cartProduct.productId,
        quantity: cartProduct.qty,
        note: cartProduct.note,
        toppings: cartProduct.product.selectedToppings,
      };
      itemProduct.push(OrderItem);
    });
    return itemProduct;
  };
  useEffect(() => {
    if (branchSelecting) setOrderInput({ ...orderInput, shopBranchId: branchSelecting.id });
  }, []);
  useEffect(() => {
    if (locationCustomer)
      setOrderInput({
        ...orderInput,
        longitude: locationCustomer.longitude,
        latitude: locationCustomer.latitude,
      });
  }, [locationCustomer]);
  useEffect(() => {
    if (customer) {
      setOrderInput({ ...orderInput, buyerPhone: customer });
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
          let cartProducts = [];
          if (res.data) {
            listCart.forEach((cartProduct) => {
              const product = res.data.find((x) => x.id === cartProduct.productId);

              if (product) {
                let isValid = true;
                for (let cartProductTopping of cartProduct.product
                  .selectedToppings as OrderItemToppingInput[]) {
                  const topping = product.toppings.find(
                    (x) => x.id == cartProductTopping.toppingId
                  );
                  if (!topping) {
                    isValid = false;
                    break;
                  } else {
                    const option = topping.options.find(
                      (x) => x.name == cartProductTopping.optionName
                    );
                    if (!option || option.price != cartProductTopping.price) {
                      isValid = false;
                      break;
                    }
                  }
                }
                if (isValid) cartProducts.push(cartProduct);
              }
            });
          }
          setCartProducts(cartProducts);
        });
      }
    }
  }, []);

  useEffect(() => {
    setTotalFood(cartProducts.reduce((count, item) => (count += item.qty), 0));
    setTotalMoney(cartProducts.reduce((total, item) => (total += item.amount), 0));
    localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
  }, [cartProducts]);

  const addProductToCart = (product: Product, qty: number, note: string): boolean => {
    if (!qty) return false;
    let productIndex = cartProducts.findIndex(
      (x) =>
        x.productId == product.id &&
        JSON.stringify(x.product.selectedToppings) == JSON.stringify(product.selectedToppings)
    );
    if (productIndex >= 0) {
      changeProductQuantity(productIndex, cartProducts[productIndex].qty + qty);
    } else {
      let price =
        product.basePrice +
        product.selectedToppings.reduce((total, topping) => total + topping.price, 0);
      cartProducts.push({
        productId: product.id,
        product: product,
        qty,
        price: price,
        amount: price * qty,
        note: note,
      });
    }
    console.log(cartProducts);
    setCartProducts([...cartProducts]);
    return true;
  };

  const changeProductQuantity = (productIndex: number, qty: number) => {
    if (productIndex < 0 || productIndex >= cartProducts.length) return;

    if (qty) {
      cartProducts[productIndex].qty = qty;
      cartProducts[productIndex].amount = cartProducts[productIndex].price * qty;
      setCartProducts([...cartProducts]);
    } else {
      removeProductFromCart(productIndex);
    }
  };

  const removeProductFromCart = (productIndex: number) => {
    if (productIndex >= 0) {
      cartProducts.splice(productIndex, 1);
      setCartProducts([...cartProducts]);
    }
  };

  const generateDraftOrder = () => {
    let items = getItemsOrderInput();
    OrderService.generateDraftOrder({ ...orderInput, items: items })
      .then((res: any) => {
        setDraftOrder(cloneDeep(res));
        if (res.invalid) {
          // toast.error(res.invalidReason);
        }
      })
      .catch((err) => {});
  };

  const generateOrder = () => {
    if (!draftOrder.invalid) {
      let items = getItemsOrderInput();
      return OrderService.generateOrder({ ...orderInput, items: items })
        .then((res) => {
          toast.success("Đặt hàng thành công");
          localStorage.removeItem("cartProducts");
          setCartProducts([]);
          resetOrderInput();
          router.push("/order/" + res.code);
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
