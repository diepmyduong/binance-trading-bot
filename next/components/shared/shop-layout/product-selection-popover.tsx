import { useEffect, useState } from "react";
import { RiCloseCircleLine, RiSearch2Line } from "react-icons/ri";
import { forceCheck } from "react-lazyload";
import { convertViToEn } from "../../../lib/helpers/convert-vi-to-en";
import { NumberPipe } from "../../../lib/pipes/number";
import { Product, ProductService } from "../../../lib/repo/product.repo";
import { Input } from "../utilities/form/input";
import { Img } from "../utilities/img";
import { NotFound } from "../utilities/not-found";
import { Popover, PopoverProps } from "../utilities/popover/popover";
import { Spinner } from "../utilities/spinner";

interface PropsType extends PopoverProps {
  onProductSelect: (product: Product) => any;
}
export function ProductSelectionPopover({ onProductSelect, ...props }: PropsType) {
  const [searchText, setSearchText] = useState("");
  const [products, setProducts] = useState<Product[]>();
  const [filterProducts, setFilterProducts] = useState<Product[]>();

  useEffect(() => {
    if (products) {
      setFilterProducts(
        products.filter((product) => {
          if (searchText) {
            return convertViToEn(product.name).includes(convertViToEn(searchText));
          } else {
            return true;
          }
        })
      );
    }
  }, [products, searchText]);

  useEffect(() => {
    ProductService.getAll({ query: { limit: 0 }, fragment: "id image name basePrice" }).then(
      (res) => {
        setProducts(res.data);
      }
    );
  }, []);

  return (
    <Popover
      trigger="click"
      arrow={true}
      placement="auto-start"
      onShown={() => {
        setTimeout(() => forceCheck(), 100);
      }}
      {...props}
    >
      {!products ? (
        <Spinner />
      ) : (
        <div style={{ width: "450px", marginLeft: "-9px", marginRight: "-9px" }}>
          <Input
            className="border-0 no-focus"
            placeholder="Tìm kiếm sản phẩm"
            prefix={<RiSearch2Line />}
            clearable
            value={searchText}
            onChange={setSearchText}
          />
          <div className="p-4 border-t border-gray-200 v-scrollbar" style={{ height: "450px" }}>
            {!filterProducts?.length && (
              <NotFound icon={<RiCloseCircleLine />} text="Không có mẫu topping nào" />
            )}
            {filterProducts?.map((product) => (
              <div
                className={`flex items-center border border-gray-300 hover:border-primary hover:bg-primary-light transition-colors duration-150 shadow-sm rounded mb-2 p-3 cursor-pointer`}
                key={product.id}
                onClick={() => {
                  onProductSelect(product);
                  (props.reference.current as any)._tippy.hide();
                }}
              >
                <Img className="w-12" src={product.image} compress={50} />
                <div className="font-semibold pl-3">
                  <div className="text-gray-800">{product.name}</div>
                  <div className="text-danger">{NumberPipe(product.basePrice, true)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Popover>
  );
}
