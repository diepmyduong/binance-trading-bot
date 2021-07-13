import { createContext, useContext, useEffect, useState } from "react";
import { OrderItemToppingInput } from "../../../../lib/repo/order.repo";
import { Product, ProductService } from "../../../../lib/repo/product.repo";
import cloneDeep from "lodash/cloneDeep";
import { ProductTopping, ToppingOption } from "../../../../lib/repo/product-topping.repo";
export const ProductDetailContext = createContext<
  Partial<{
    product: Product;
    dataTopping: any;
    setDataTopping: any;
    totalMoney: number;
    qty: number;
    setQty: any;
    toppings: OrderItemToppingInput[];
    onChangeQuantity: (qty: number) => any;
    onToppingOptionClick: (option: ToppingOption, topping: ProductTopping) => any;
  }>
>({});

export function ProductDetailProvider({ productCode, ...props }) {
  const [product, setProduct] = useState<Product>();
  const [qty, setQty] = useState(1);
  const [dataTopping, setDataTopping] = useState<any>([]);
  const [toppings, setToppings] = useState<OrderItemToppingInput[]>([]);
  const [totalMoney, setTotalMoney] = useState(0);
  const loadProduct = () => {
    setProduct(null);
    ProductService.getAll({
      fragment: ProductService.fullFragment,
      query: { limit: 1, filter: { code: productCode } },
    })
      .then((res) => {
        if (res) {
          let newProduct = cloneDeep(res.data[0]) as Product;
          newProduct.toppings.forEach((topping) => {
            if (topping.required || topping.min >= 1) {
              for (let i = 0; i < topping.min; i++) {
                topping.options[0].selected = true;
              }
            }
            topping.selectedOptions = topping.options.filter((x) => x.selected);
          });
          newProduct.selectedToppings = newProduct.toppings.reduce(
            (options, topping) => [
              ...options,
              ...topping.options
                .filter((x) => x.selected)
                .map((option) => ({
                  toppingId: topping.id,
                  toppingName: topping.name,
                  optionName: option.name,
                  price: option.price,
                })),
            ],
            []
          );
          setProduct(newProduct);
        }
      })
      .catch((err) => {});
  };
  const handleAddTopping = (data) => {
    let arr: OrderItemToppingInput[] = [];
    for (var item in data) {
      arr.push({ ...data[item] });
    }
    setToppings([...arr]);
  };

  const onToppingOptionClick = (option: ToppingOption, topping: ProductTopping) => {
    if (option.selected) {
      if (
        topping.required &&
        topping.min == topping.selectedOptions.length &&
        topping.selectedOptions.find((x) => x.name == option.name)
      ) {
        return;
      } else {
        option.selected = false;
        topping.selectedOptions = topping.selectedOptions.filter((x) => x.name == option.name);
      }
    } else {
      if (topping.max && topping.max == topping.selectedOptions.length) {
        topping.options.find((x) => x.name == topping.selectedOptions[0].name).selected = false;
        topping.selectedOptions = topping.selectedOptions.slice(1);
      }
      option.selected = true;
      topping.selectedOptions.push(option);
    }
    product.selectedToppings = product.toppings.reduce(
      (options, topping) => [
        ...options,
        ...topping.options
          .filter((x) => x.selected)
          .map((option) => ({
            toppingId: topping.id,
            toppingName: topping.name,
            optionName: option.name,
            price: option.price,
          })),
      ],
      []
    );
    setProduct({ ...product });
  };

  const onChangeQuantity = (qty) => {
    setQty(qty);
  };

  const calculateTotalMoney = () => {
    if (product) {
      setTotalMoney(
        (product.basePrice +
          product.toppings.reduce(
            (total, topping) =>
              total +
              topping.options
                .filter((x) => x.selected)
                .reduce((toppingTotal, option) => toppingTotal + option.price, 0),
            0
          )) *
          qty
      );
    } else {
      setTotalMoney(0);
    }
  };

  useEffect(() => {
    handleAddTopping(dataTopping);
  }, [dataTopping]);

  useEffect(() => {
    // setToppings([]);
    // setQty(1);
    // setDataTopping([]);
    // if (product) setTotalMoney(productDetail.basePrice * qty);
    calculateTotalMoney();
  }, [product, qty]);
  // useEffect(() => {
  //   let total = 0;
  //   if (productDetail) {
  //     toppings.forEach((item) => (total += item.price));
  //     total += productDetail.downPrice * qty;
  //     setTotalMoney(total);
  //   }
  // }, [qty, toppings]);
  useEffect(() => {
    loadProduct();
  }, [productCode]);
  return (
    <ProductDetailContext.Provider
      value={{
        product,
        dataTopping,
        setDataTopping,
        totalMoney,
        qty,
        toppings,
        setQty,
        onChangeQuantity,
        onToppingOptionClick,
      }}
    >
      {props.children}
    </ProductDetailContext.Provider>
  );
}

export const useProductDetailContext = () => useContext(ProductDetailContext);
