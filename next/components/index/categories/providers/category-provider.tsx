import { createContext, useContext, useEffect, useState } from "react";
import { Category, CategoryService } from "../../../../lib/repo/category.repo";
import { Product, ProductService } from "../../../../lib/repo/product.repo";
import cloneDeep from "lodash/cloneDeep";
import useDebounce from "../../../../lib/hooks/useDebounce";
export const CategoryContext = createContext<
  Partial<{
    categories: Category[];
    products: Product[];
    setSearch: Function;
    category: Category;
    breadcrumbs: { label: string; href: string }[];
    loading: boolean;
    searchedCategory: Category[];
    searchedProduct: Product[];
    search: string;
  }>
>({});

export function CategoryProvider(props) {
  const [categories, setCategories] = useState<Category[]>(null);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<Category>(null);
  const [products, setProducts] = useState<Product[]>([null]);
  const [breadcrumbs, setBreadcrumbs] = useState<{ label: string; href: string }[]>([
    { label: "Hạng mục", href: "/category" },
  ]);
  const [searchedCategory, setSearchedCategory] = useState<Category[]>(null);
  const [searchedProduct, setSearchedProduct] = useState<Product[]>(null);
  const debounceSearch = useDebounce(search, 3000);
  const loadProduct = async () => {
    if (props.categoryId) {
      console.log(props.categoryId);
      let cat = (await CategoryService.getOne({ id: props.categoryId })) as Category;
      let index = breadcrumbs.findIndex((item) => item.label === cat.name);
      let breads = breadcrumbs;
      if (index === -1) {
        breads.push({ label: cat.name, href: "/category/" + cat.code });
      } else {
        breads.splice(index + 1, breads.length);
      }
      console.log(breads);
      setBreadcrumbs(cloneDeep(breads));
      if (cat) {
        let res = await CategoryService.getAll({
          query: {
            limit: 0,
            filter: {
              _id: { $in: cat.subCategoryIds },
            },
          },
        });
        let res2 = await ProductService.getAll({
          query: {
            limit: 0,
            filter: { categoryId: cat.id },
          },
        });
        setCategory(cat);
        setProducts(cloneDeep(res2.data));
        console.log(res.data);
        setCategories(cloneDeep(res.data));
      }
    } else {
      let res = await CategoryService.getAll({
        query: {
          limit: 0,
          filter: {
            parentIds: { $size: 0 },
          },
        },
      });
      setProducts(cloneDeep(null));
      setCategories(cloneDeep(res.data));
    }
  };
  useEffect(() => {
    let tasks = [];
    setLoading(true);
    if (debounceSearch) {
      tasks.push(
        CategoryService.getAll({ query: { limit: 0, search: debounceSearch } }).then((res) => {
          setSearchedCategory(res.data);
        })
      );
      tasks.push(
        ProductService.getAll({ query: { limit: 0, search: debounceSearch } }).then((res) => {
          setSearchedProduct(res.data);
        })
      );
    } else {
      setSearchedCategory(null);
      setSearchedProduct(null);
    }
    Promise.all(tasks);
    setLoading(false);
  }, [debounceSearch]);
  useEffect(() => {
    loadProduct();
  }, [props.categoryId]);
  return (
    <CategoryContext.Provider
      value={{
        categories,
        breadcrumbs,
        products,
        category,
        setSearch,
        searchedCategory,
        loading,
        search,
        searchedProduct,
      }}
    >
      {props.children}
    </CategoryContext.Provider>
  );
}

export const useCategoryContext = () => useContext(CategoryContext);
