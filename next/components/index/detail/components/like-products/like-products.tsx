import React, { useState } from "react";
import ProductCard from "./product-card";
import { Product, ProductService } from "../../../../../lib/repo/product.repo";
import { useEffect } from "react";
interface Propstype extends ReactProps {
  product: Product;
}

const LikeProducts = (props: Propstype) => {
  const [likeProduct, setLikeProduct] = useState<Product[]>([]);
  useEffect(() => {
    ProductService.getAll({
      query: {
        limit: 10,
        filter: {
          categoryId: props.product.categoryId,
        },
      },
    }).then((res) => {
      if (res) {
        setLikeProduct([...res.data]);
      }
    });
  }, []);
  return (
    <>
      <h3 className="w-full text-sm sm:text-base">Sản phẩm tương tự</h3>
      {(likeProduct.length > 0 && (
        <div className="flex overflow-scroll overflow-x-auto overflow-y-hidden space-x-6">
          {likeProduct.map((item, index) => (
            <ProductCard
              product={{
                name: item.name,
                price: item.basePrice,
                img: item.images[0],
                type: item.category.name,
                code: item.code,
                unit: item.unit,
              }}
              key={index}
            />
          ))}
        </div>
      )) || <p>Chưa có sản phẩm tương tư</p>}
    </>
  );
};

export default LikeProducts;
