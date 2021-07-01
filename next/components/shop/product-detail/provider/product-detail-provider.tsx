import { createContext, useContext, useEffect, useState } from "react";
import { PaginationQueryProps, usePaginationQuery } from "../../../../lib/hooks/usePaginationQuery";
import { Post, PostService } from "../../../../lib/repo/post.repo";
import { Product, ProductService } from "../../../../lib/repo/product.repo";
export const ProductDetailContext = createContext<
  PaginationQueryProps<Product> & {
    [x: string]: any;
  }
>({});

export function ProductDetailProvider({ productId, ...props }) {
  const [productDetail, setProductDetail] = useState<Product>();
  const loadProduct = () => {
    ProductService.getOne({ id: productId }).then((res) => {
      console.log(res);
      setProductDetail(res);
    });
  };
  useEffect(() => {
    loadProduct();
  }, [productId]);
  return <ProductDetailContext.Provider value={{}}>{props.children}</ProductDetailContext.Provider>;
}

export const useProductDetailContext = () => useContext(ProductDetailContext);
