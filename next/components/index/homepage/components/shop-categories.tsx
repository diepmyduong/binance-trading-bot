import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useShopContext } from "../../../../lib/providers/shop-provider";
import { Category } from "../../../../lib/repo/category.repo";
import { Product } from "../../../../lib/repo/product.repo";
import { Price } from "../../../shared/homepage-layout/price";
import { Rating } from "../../../shared/homepage-layout/rating";
import { Img } from "../../../shared/utilities/img";
import { SwitchTabs } from "../../../shared/utilities/tab/switch-tabs";
import { HightLightCategories } from "./hight-light-categories";
interface ShopCategoriesPropsType extends ReactProps {}

export function ShopCategories(props: ShopCategoriesPropsType) {
  const { productShop } = useShopContext();
  const [isViewing, setIsViewing] = useState<number>();
  const [isClickView, setIsClickView] = useState(false);
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom / 2 <= (window.innerHeight || document.documentElement.clientHeight) &&
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
              clearInterval(scrollCheckInterval);
            }, 300);
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
    console.log(index);
    setIsClickView(true);
    setIsViewing(index);
    setTimeout(() => {
      document.getElementsByClassName("menu-container")[index].scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "start",
      });
    }, 400);
    setTimeout(() => {
      setIsClickView(false);
    }, 300);
  };
  return (
    <div className="bg-white mt-4">
      <HightLightCategories />
      {productShop?.length > 0 && (
        <>
          <SwitchTabs
            chevron
            id="menus"
            value={isViewing}
            className=" sticky top-14 bg-white z-20 shadow-sm "
            native
            options={[
              ...productShop.map(
                (item, index) =>
                  item.productIds.length > 0 && {
                    value: index,
                    label: item.name,
                  }
              ),
            ]}
            onChange={(val) => handleChange(val)}
          />
          <div className="flex flex-col bg-gray-200 ">
            {productShop.map(
              (item: Category, index: number) =>
                item.productIds.length > 0 && (
                  <ShopCategory list={item.products} title={item.name} key={index} />
                )
            )}
          </div>
        </>
      )}
    </div>
  );
}

interface ShopCategoryPropsType extends ReactProps {
  list: Product[];
  title: string;
}
export function ShopCategory(props: ShopCategoryPropsType) {
  const router = useRouter();
  const query = router.query;
  const url = new URL(location.href);
  const handleClick = (code) => {
    url.searchParams.set("productId", code);
    router.push(url.toString(), null, { shallow: true });
  };
  return (
    <div id={props.title} className="relative menu bg-white mb-2">
      <div className=" absolute -top-28 menu-container"></div>
      <p className="font-semibold text-primary pt-2 pl-4 text-lg menu-title">{props.title}</p>
      {props.list.length > 0 && (
        <>
          {props.list.map((item: Product, index: number) => (
            <div
              key={index}
              className="flex items-center py-2 px-4 hover:bg-primary-light cursor-pointer border-b transition-all duration-300"
              onClick={() => {
                handleClick(item.code);
              }}
            >
              <div className="flex-1 pr-2 h-full flex flex-col">
                <p className="font-semibold">{item.name}</p>
                <p className="text-gray-500 text-sm">{item.subtitle}</p>
                <Rating rating={item.rating || 4.8} textSm soldQty={item.soldQty} />
                <p className="text-gray-400 text-sm">{item.des}</p>
                <Price
                  price={item.basePrice}
                  saleRate={item.saleRate}
                  downPrice={item.downPrice}
                  textDanger
                  className="mt-auto"
                />
              </div>
              {item.labels && (
                <ul className="flex flex-wrap text-sm font-bold text-white">
                  {item.labels.map((item, index) => {
                    <i
                      key={index}
                      style={{ backgroundColor: item.color }}
                      className="px-2 mx-2 rounded-sm"
                    >
                      {item.name}
                    </i>;
                  })}
                </ul>
              )}
              <Img src={item.image} className="w-20 sm:w-24 rounded-sm" />
            </div>
          ))}
        </>
      )}
    </div>
  );
}
