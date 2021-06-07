import React from "react";
import { useCategoryContext } from "./providers/category-provider";
import { Search } from "./components/search";
import { Spinner } from "../../shared/utilities/spinner";
import CategoryOptions from "./components/category-options";
import CategoryProducts from "./components/category-products";

const CategoryPage = (props) => {
  const {
    categories,
    breadcrumbs,
    products,
    category,
    setSearch,
    search,
    searchedCategory,
    searchedProduct,
  } = useCategoryContext();
  return (
    <div className="main-container px-2 sm:px-10 py-10 my-10 space-y-8 bg-white ">
      <div className="w-2/5">
        <Search value={search} onChange={(e) => setSearch(e)} />
      </div>
      <>
        <CategoryOptions
          categories={search ? searchedCategory : categories}
          category={category}
          breadCrumbs={breadcrumbs}
          search={search}
        />
        {products || (search && searchedProduct) ? (
          <CategoryProducts products={search ? searchedProduct : products} search={search} />
        ) : (
          <p>Chọn "Hạng mục" hoặc "Tìm kiếm" sản phẩm</p>
        )}
      </>
    </div>
  );
};

export default CategoryPage;
