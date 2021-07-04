import { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "../../../../lib/providers/toast-provider";
import { Category, CategoryService } from "../../../../lib/repo/category.repo";
import { Product, ProductService } from "../../../../lib/repo/product.repo";
import cloneDeep from "lodash/cloneDeep";
import { ProductTopping, ProductToppingService } from "../../../../lib/repo/product-topping.repo";

export const ProductsContext = createContext<
  Partial<{
    categories: Category[];
    loadCategories: (reset?: boolean) => Promise<any>;
    removeCategory: (category: Category) => Promise<any>;
    onProductChange: (product: Product, category: Category) => any;
    onDeleteProduct: (product: Product, category: Category) => Promise<any>;
    onToggleProduct: (product: Product, category: Category) => Promise<any>;
    toppings: ProductTopping[];
    loadToppings: () => Promise<any>;
  }>
>({});
export function ProductsProvider(props) {
  const [categories, setCategories] = useState<Category[]>(null);
  const [toppings, setToppings] = useState<ProductTopping[]>(null);
  const toast = useToast();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async (reset: boolean = false) => {
    if (reset) await CategoryService.clearStore();
    CategoryService.getAll({
      query: {
        limit: 0,
        order: { priority: -1, createdAt: 1 },
      },
      fragment: CategoryService.fullFragment,
    }).then((res) => {
      setCategories(cloneDeep(res.data));
    });
  };

  const removeCategory = async (category: Category) => {
    await CategoryService.delete({ id: category.id });
    await loadCategories();
  };

  const onProductChange = (product: Product, category: Category) => {
    let cat = categories.find((x) => x.id == category.id);
    if (cat) {
      let index = cat.products.findIndex((x) => x.id == product.id);
      if (index >= 0) {
        cat.products[index] = { ...product };
      } else {
        cat.products.push({ ...product });
        cat.productIds.push(product.id);
      }
      setCategories([...categories]);
    }
  };

  const onDeleteProduct = async (product: Product, category: Category) => {
    try {
      await ProductService.delete({ id: product.id, toast });
      let cat = categories.find((x) => x.id == category.id);
      if (cat) {
        let index = cat.products.findIndex((x) => x.id == product.id);
        if (index >= 0) {
          cat.products.splice(index, 1);
          setCategories([...categories]);
        }
      }
    } catch (err) {}
  };

  const onToggleProduct = async (product: Product, category: Category) => {
    try {
      let allowSale = product.allowSale;
      let cat = categories.find((x) => x.id == category.id);
      let index = cat.products.findIndex((x) => x.id == product.id);
      cat.products[index] = { ...product, allowSale: !allowSale };
      setCategories([...categories]);
      await ProductService.update({
        id: product.id,
        data: { allowSale: !allowSale },
      })
        .then((res) => toast.success("Mở bán sản phẩm thành công"))
        .catch((err) => {
          toast.error("Mở bán sản phẩm thất bại");
          cat.products[index] = { ...product, allowSale };
          setCategories([...categories]);
        });
    } catch (err) {}
  };

  const loadToppings = async () => {
    ProductToppingService.getAll({
      query: {
        limit: 0,
        order: { createdAt: -1 },
      },
    }).then((res) => {
      setToppings(cloneDeep(res.data));
    });
  };

  return (
    <ProductsContext.Provider
      value={{
        categories,
        loadCategories,
        removeCategory,
        onProductChange,
        onDeleteProduct,
        onToggleProduct,
        toppings,
        loadToppings,
      }}
    >
      {props.children}
    </ProductsContext.Provider>
  );
}

export const useProductsContext = () => useContext(ProductsContext);
