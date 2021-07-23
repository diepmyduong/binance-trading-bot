import { Img } from "../../../shared/utilities/img";
import { useRouter } from "next/router";
import { Price } from "../../../shared/homepage-layout/price";
import { ShopProductGroup } from "../../../../lib/repo/shop-config.repo";
import { Product } from "../../../../lib/repo/product.repo";
import { ImgProduct } from "../../../shared/homepage-layout/img-product";
import Link from "next/link";
interface Propstype extends ReactProps {
  productGroups: ShopProductGroup[];
}
export function ProductsGroup(props: Propstype) {
  return (
    <div>
      {props.productGroups.map((item: ShopProductGroup, index) => (
        <div className={`border-t-8 border-b-8 py-2 ${item.isPublic ? "" : "hidden"}`} key={index}>
          <h3 className="font-semibold pb-2 px-4 text-lg text-primary">{item.name}</h3>
          <div className="grid grid-cols-2 gap-4 px-4">
            {item.products?.map((item: Product, index) => (
              <Link
                key={index}
                href={{ pathname: location.pathname, query: { product: item.code } }}
                shallow
              >
                <a>
                  <div
                    className={`col-span-1 transition-all duration-300 cursor-pointer group  ${
                      item.allowSale ? "" : "hidden"
                    }`}

                    // onClick={() => handleClick(item.code)}
                  >
                    <ImgProduct
                      src={item.image}
                      className="min-w-4xs rounded-sm"
                      compress={232}
                      saleRate={item.saleRate}
                    />
                    <p className="font-semibold group-hover:text-primary-dark transition-all duration-200">
                      {item.name}
                    </p>
                    <Price
                      price={item.basePrice}
                      downPrice={item.downPrice}
                      textDanger
                      className="group-hover:text-danger-dark"
                    />
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
