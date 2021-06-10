import { RiFile3Fill, RiFolder2Line, RiSearchLine } from "react-icons/ri";
import { Button } from "../../../shared/utilities/form/button";
import { Input } from "../../../shared/utilities/form/input";
import { Spinner } from "../../../shared/utilities/spinner";
import { useProductsContext } from "../providers/products-provider";

interface PropsType extends ReactProps {}

export function Search({ ...props }: PropsType) {
  const { search, setSearch, searchedProduct, searchedCategory, selectItem } = useProductsContext();

  return (
    <>
      <div className="border-b border-gray-200">
        <Input
          clearable
          className="w-full border-0 rounded-none py-3"
          prefix={
            <i>
              <RiSearchLine />
            </i>
          }
          debounce={300}
          placeholder="Tìm kiếm danh mục hoặc sản phẩm"
          value={search}
          onChange={setSearch}
        />
      </div>
      {search && (
        <div className="flex-1 p-3">
          {!searchedProduct || !searchedCategory ? (
            <Spinner />
          ) : (
            <>
              <div className="font-semibold text-gray-500 py-1 pl-1">
                Kết quả tìm kiếm danh mục ({searchedCategory.length})
              </div>
              {searchedCategory?.map((category) => (
                <Button
                  className="w-full px-1 h-8 justify-start"
                  icon={<RiFolder2Line />}
                  text={category.name}
                  onClick={(e) => {
                    selectItem(category);
                    setSearch("");
                  }}
                  key={category.id}
                />
              ))}
              <div className="font-semibold text-gray-500 py-1 pl-1">
                Kết quả tìm kiếm sản phẩm ({searchedProduct.length})
              </div>
              {searchedProduct?.map((product) => (
                <Button
                  className="w-full px-1 h-8 justify-start"
                  icon={<RiFile3Fill />}
                  text={product.name}
                  onClick={(e) => {
                    selectItem(product);
                    setSearch("");
                  }}
                  key={product.id}
                />
              ))}
            </>
          )}
        </div>
      )}
    </>
  );
}
