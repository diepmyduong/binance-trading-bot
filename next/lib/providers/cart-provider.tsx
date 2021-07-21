import { createContext, useContext, useEffect, useState } from "react";
import { Product, ProductService } from "../repo/product.repo";
import { OrderItemToppingInput, ToppingOption } from "../repo/product-topping.repo";
import cloneDeep from "lodash/cloneDeep";
import { Order, OrderInput, OrderItemInput, OrderService, OrderItem } from "../repo/order.repo";
import { useShopContext } from "./shop-provider";
import { useToast } from "./toast-provider";
import { useRouter } from "next/router";

export const CartContext = createContext<
  Partial<{
    // draftOrder?: any;
    reOrderInput?: OrderInput;
    // setOrderInput?: (val: OrderInput) => any;
    // inforBuyers: any;
    // setInforBuyers: any;
    totalFood: number;
    totalMoney: number;
    cartProducts: CartProduct[];
    // resetOrderInput: Function;
    // generateOrder: () => any;
    // generateDraftOrder: Function;
    addProductToCart: (product: Product, qty: number, note: string) => any;
    changeProductQuantity: (productIndex: number, qty: number) => any;
    removeProductFromCart: (productIndex: number) => any;
    reOrder: (items: OrderItem[], reOderInput: OrderInput) => any;
    saleUpProducts: Product[];
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
  const [reOrderInput, setReOrderInput] = useState<OrderInput>();
  const router = useRouter();
  const toast = useToast();

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
  const reOrder = (items: OrderItem[], reOderInput: OrderInput) => {
    let resCartProducts = [...items];
    console.log(reOderInput);
    setReOrderInput(cloneDeep(reOderInput));
    if (resCartProducts) {
      // lấy danh sách product mua lại
      ProductService.getAll({
        query: {
          limit: 0,
          filter: {
            _id: { __in: resCartProducts.map((x) => x.productId) },
          },
        },
      }).then((res) => {
        let listCartNew = cartProducts;
        console.log(items);

        resCartProducts.forEach((reCartProduct) => {
          let { __typename, ...product } = res.data.find((x) => x.id == reCartProduct.productId);
          if (product) {
            let index = listCartNew.findIndex((x) => x.productId == product.id);
            console.log(index);
            if (index !== -1) {
              listCartNew.splice(index, 1);
            }
            let price = product.basePrice;
            if (reCartProduct.toppings) {
              price += reCartProduct.toppings.reduce((total, topping) => total + topping.price, 0);
              product.selectedToppings = reCartProduct.toppings.map(
                (item: OrderItemToppingInput) => {
                  return {
                    toppingId: item.toppingId,
                    toppingName: item.toppingName,
                    optionName: item.optionName,
                    price: item.price,
                  };
                }
              );
            }
            listCartNew = [
              {
                productId: product.id,
                product: product,
                qty: reCartProduct.qty,
                price: price,
                amount: price * reCartProduct.qty,
                note: reCartProduct.note,
                topping: reCartProduct.toppings,
              },
              ...listCartNew,
            ];
          }
        });
        console.log(listCartNew);

        setCartProducts([...listCartNew]);
      });

      router.push("/payment");
    }
  };

  const [saleUpProducts, setSaleUpProducts] = useState<Product[]>([]);

  useEffect(() => {
    let upSalePros = saleUpProducts;
    cartProducts.forEach((cart) => {
      let upsale = cart.product.upsaleProducts;
      if (upsale && upsale.length > 0) {
        cart.product.upsaleProducts.forEach((product) => {
          let index = upSalePros.findIndex((p) => p.id === product.id);
          if (index === -1) {
            upSalePros.push(product);
          }
        });
      }
    });
    ProductService.getAll({
      query: {
        limit: 0,
        filter: {
          _id: { __in: upSalePros.map((x) => x.id) },
        },
      },
    }).then((res) => setSaleUpProducts(cloneDeep(res.data)));
  }, [cartProducts]);

  return (
    <CartContext.Provider
      value={{
        reOrder,
        reOrderInput,
        totalFood,
        totalMoney,
        cartProducts,
        addProductToCart,
        removeProductFromCart,
        changeProductQuantity,
        saleUpProducts,
      }}
    >
      {props.children}
    </CartContext.Provider>
  );
}

export const useCartContext = () => useContext(CartContext);
