import { createContext, useContext, useEffect, useState } from "react";
import { OrderItemToppingInput } from "../../../../lib/repo/order.repo";
import { Product, ProductService } from "../../../../lib/repo/product.repo";
export const ProductDetailContext = createContext<
  Partial<{
    [x: string]: any;
    productDetail?: Product;
    setProductDetail: any;
    dataTopping: any;
    setDataTopping: any;
    totalMoney: number;
    qty: number;
    setQty: any;
    toppings?: OrderItemToppingInput[];
  }>
>({});

export function ProductDetailProvider({ productId, ...props }) {
  const [productDetail, setProductDetail] = useState<Product>();
  const [qty, setQty] = useState(1);
  const [dataTopping, setDataTopping] = useState<any>([]);
  const [toppings, setToppings] = useState<OrderItemToppingInput[]>([]);
  const [totalMoney, setTotalMoney] = useState(0);
  const loadProduct = () => {
    ProductService.getAll({ query: { filter: { code: productId } } })
      .then((res) => {
        if (res) setProductDetail(res.data[0]);
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
  useEffect(() => {
    handleAddTopping(dataTopping);
  }, [dataTopping]);

  useEffect(() => {
    setToppings([]);
    setQty(1);
    setDataTopping([]);
    if (productDetail) setTotalMoney(productDetail.basePrice * qty);
  }, [productDetail]);
  useEffect(() => {
    let total = 0;
    if (productDetail) {
      toppings.forEach((item) => (total += item.price));
      total += productDetail.downPrice * qty;
      setTotalMoney(total);
    }
  }, [qty, toppings]);
  useEffect(() => {
    loadProduct();
  }, [productId]);
  return (
    <ProductDetailContext.Provider
      value={{
        productDetail,
        setProductDetail,
        dataTopping,
        setDataTopping,
        totalMoney,
        qty,
        toppings,
        setQty,
      }}
    >
      {props.children}
    </ProductDetailContext.Provider>
  );
}

export const useProductDetailContext = () => useContext(ProductDetailContext);
