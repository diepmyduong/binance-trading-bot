import { createContext, useContext, useEffect, useState } from "react";
import { PaginationQueryProps, usePaginationQuery } from "../../../../lib/hooks/usePaginationQuery";
import { Post, PostService } from "../../../../lib/repo/post.repo";
import { Product, ProductService } from "../../../../lib/repo/product.repo";
export const ProductDetailContext = createContext<
  PaginationQueryProps<Product> & {
    [x: string]: any;
    productDetail?: Product;
  }
>({});

export function ProductDetailProvider({ productId, ...props }) {
  const [productDetail, setProductDetail] = useState<Product>();
  const loadProduct = () => {
    ProductService.getAll({ query: { filter: { code: productId } } })
      .then((res) => {
        console.log("res, productId", res.data[0], productId);
        if (res) setProductDetail(res.data[0]);
      })
      .catch((err) => {});
  };
  useEffect(() => {
    loadProduct();
  }, [productId]);
  return (
    <ProductDetailContext.Provider value={{ productDetail }}>
      {props.children}
    </ProductDetailContext.Provider>
  );
}

export const useProductDetailContext = () => useContext(ProductDetailContext);
