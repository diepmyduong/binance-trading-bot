import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Pagination, Autoplay } from "swiper/core";
import { ShopBanner } from "../../../../lib/repo/banner.repo";
import { useRouter } from "next/router";
import { Img } from "../../../shared/utilities/img";
import { PromotionDetailDialog } from "../../promotion/components/promotion-detail.tsx/promotion-detail-dialog";
import { ShopVoucher, ShopVoucherService } from "../../../../lib/repo/shop-voucher.repo";
import cloneDeep from "lodash/cloneDeep";
// install Swiper modules
SwiperCore.use([Pagination, Autoplay]);
interface Propstype extends ReactProps {
  banner: ShopBanner[];
}
export function BannerPromtion(props: Propstype) {
  useEffect(() => {
    console.log(props.banner);
  }, []);
  const router = useRouter();
  const query = router.query;
  const [voucher, setVoucher] = useState<ShopVoucher>();
  const url = new URL(location.href);
  const handleClick = (banner: ShopBanner) => {
    switch (banner.actionType) {
      case "PRODUCT":
        {
          url.searchParams.set("productId", banner.product.code);
          router.push(url.toString(), null, { shallow: true });
        }
        break;
      case "WEBSITE":
        {
          router.push(banner.link);
        }
        break;
      case "VOUCHER":
        {
          if (banner.voucherId) {
            ShopVoucherService.getOne({ id: banner.voucherId }).then((res) =>
              setVoucher(cloneDeep(res))
            );
          }
        }
        break;
      default:
        break;
    }
  };
  return (
    <div className={`mt-4 ${props.className} `}>
      <Swiper
        spaceBetween={10}
        loop={true}
        autoplay={{
          delay: 8000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
      >
        {props.banner.map((item: ShopBanner, index) => (
          <SwiperSlide
            key={index}
            onClick={() => handleClick(item)}
            className={`cursor-pointer ${item.isPublic ? "" : "hidden"}`}
          >
            <div>
              <Img key={index} src={item.image || "/assets/default/default.png"} ratio169 />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <PromotionDetailDialog
        isOpen={voucher ? true : false}
        promotion={voucher}
        onClose={() => setVoucher(null)}
      />
    </div>
  );
}
