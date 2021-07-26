import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useShopContext } from "../../../../lib/providers/shop-provider";
import { Category } from "../../../../lib/repo/category.repo";
import { Product } from "../../../../lib/repo/product.repo";
import { Price } from "../../../shared/homepage-layout/price";
import { Rating } from "../../../shared/homepage-layout/rating";
import { Img } from "../../../shared/utilities/img";
import { SwitchTabs } from "../../../shared/utilities/tab/switch-tabs";
import { ProductsGroup } from "./products-group";
import { ImgProduct } from "../../../shared/homepage-layout/img-product";
import Link from "next/link";
import { useHomeContext } from "../providers/homepage-provider";
import { Spinner } from "../../../shared/utilities/spinner";
interface ShopCategoriesPropsType extends ReactProps {}

export function ShopCategories(props: ShopCategoriesPropsType) {
  const { shop } = useShopContext();
  const [isViewing, setIsViewing] = useState<number>();
  const [isClickView, setIsClickView] = useState(false);
  const { categoryContext } = useHomeContext();
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top > 100 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
  function menuScrollEvent() {
    let scrollCheckInterval = null;
    let menulist = document.getElementsByClassName("menu-title");
    if (!isClickView && menulist && menulist.length > 0) {
      scrollCheckInterval = setInterval(() => {
        for (let index = 0; index < menulist.length; index++) {
          let position = isInViewport(menulist[index]);
          if (position) {
            setTimeout(() => {
              setIsViewing(index);
              // if (isInViewport(menulist[menulist.length - 1])) {
              //   setTimeout(() => {
              //     setIsViewing(menulist.length - 1);
              //     clearInterval(scrollCheckInterval);
              //   }, 200);
              // }
              clearInterval(scrollCheckInterval);
            }, 100);
            break;
          }
        }
      }, 300);
    }
  }
  useEffect(() => {
    document.addEventListener("scroll", menuScrollEvent, {
      passive: true,
    });
    return () => {
      document.removeEventListener("scroll", menuScrollEvent);
    };
  }, []);
  const handleChange = async (index: number) => {
    setIsClickView(true);
    setIsViewing(index);
    setTimeout(() => {
      document.getElementsByClassName("menu-container")[index].scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "start",
      });
    }, 200);
    setTimeout(() => {
      setIsClickView(false);
    }, 500);
  };

  return (
    <div className="bg-white mt-4">
      <ProductsGroup productGroups={shop.config.productGroups} />
      <ListCategory isViewing={isViewing} handleChange={handleChange} />
    </div>
  );
}

function ListCategory(props) {
  const { categoryContext } = useHomeContext();
  if (!categoryContext.items) return <Spinner />;
  return (
    <>
      <SwitchTabs
        chevron
        id="menus"
        value={props.isViewing}
        className=" sticky top-14 bg-white z-20 shadow-sm "
        native
        options={[
          ...categoryContext.items.map(
            (item, index) =>
              item.productIds.length > 0 && {
                value: index,
                label: item.name,
              }
          ),
        ]}
        onChange={(val) => props.handleChange(val)}
      />
      <div className="flex flex-col bg-gray-200 ">
        {categoryContext.items.map((item: Category, index: number) => (
          <ShopCategory list={item.products} title={item.name} key={index} />
        ))}
      </div>
    </>
  );
}

interface ShopCategoryPropsType extends ReactProps {
  list: Product[];
  title: string;
}
export function ShopCategory(props: ShopCategoryPropsType) {
  return (
    <div id={props.title} className="relative menu bg-white mb-2">
      <div className=" absolute -top-28 menu-container"></div>
      <p className="font-semibold text-primary pt-2 pl-4 text-lg menu-title">{props.title}</p>
      {props.list.length > 0 && (
        <>
          {props.list.map((item: Product, index: number) => (
            <Link
              key={index}
              href={{ pathname: location.pathname, query: { product: item.code } }}
              shallow
            >
              <a>
                <div
                  className={`py-2  hover:bg-primary-light cursor-pointer border-b border-gray-100 transition-all duration-300  ${
                    item.allowSale ? "" : "hidden"
                  }`}
                  // onClick={() => {
                  //   handleClick(item.code);
                  // }}
                >
                  <div className={`flex items-center px-4 `}>
                    <div className="flex-1 flex flex-col">
                      <p className="font-semibold items-start">{item.name}</p>
                      <p className="text-gray-500 text-sm">{item.subtitle}</p>
                      <Rating rating={item.rating || 4.8} textSm soldQty={item.soldQty} />
                      <p className="text-gray-400 text-sm">{item.des}</p>
                      <Price
                        price={item.basePrice}
                        downPrice={item.downPrice}
                        textDanger
                        className="justify-items-end"
                      />
                    </div>
                    <ImgProduct
                      src={item.image}
                      className="w-20 sm:w-24 rounded-sm"
                      compress={100}
                      small
                      saleRate={item.saleRate}
                    />
                  </div>
                  {item.labels?.map((label, index) => (
                    <div
                      className="ml-2 inline-flex items-center text-white rounded-full font-semibold text-xs px-2 py-1 cursor-pointer whitespace-nowrap"
                      style={{ backgroundColor: label.color }}
                      key={index}
                    >
                      <span>{label.name}</span>
                    </div>
                  ))}
                </div>
              </a>
            </Link>
          ))}
        </>
      )}
    </div>
  );
}
