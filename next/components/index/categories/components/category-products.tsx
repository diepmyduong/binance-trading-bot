import React from "react";
import { Product } from "../../../../lib/repo/product.repo";
import CategoryProductCard from "./category-product-card";
import { Spinner } from "../../../shared/utilities/spinner";
interface Propstype extends ReactProps {
  products: Product[];
  search: string;
}
const CategoryProducts = ({ products, search, ...props }: Propstype) => {
  return (
    <>
      {(products && (
        <div className="space-y-4">
          {(search && (
            <h3 className="text-24 font-bold">
              {products.length} kết quả nhóm hạng mục cho "{search}"
            </h3>
          )) || <p className="border-b pb-4">Sản phẩm hạng mục </p>}

          {(products.length > 0 && (
            <div className="flex gap-2 flex-col">
              {products.map((item, index) => (
                <CategoryProductCard key={index} product={item} />
              ))}
            </div>
          )) ||
            (!search && <p>Chưa có sản phẩm nào thuộc hạng mục này</p>)}
        </div>
      )) || <Spinner />}
    </>
  );
};

export default CategoryProducts;
