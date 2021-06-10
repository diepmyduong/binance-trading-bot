import { createContext, useContext, useEffect, useState } from "react";

import { Product, ProductService } from "../../../../lib/repo/product.repo";

export const DetailsContext = createContext<
  Partial<{
    product: Product;
  }>
>({});

export function DetailsProvider(props) {
  const [product, setProduct] = useState<Product>(null);

  const loadProduct = async () => {
    console.log(props.productId);
    let res = await ProductService.getOne({ id: props.productId });
    setProduct(res);
  };

  useEffect(() => {
    loadProduct();
  }, [props.productId]);
  return <DetailsContext.Provider value={{ product }}>{props.children}</DetailsContext.Provider>;
}

export const useDetailsContext = () => useContext(DetailsContext);
