import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Pagination, Autoplay } from "swiper/core";
import { ShopBanner } from "../../../../lib/repo/banner.repo";
import { useRouter } from "next/router";
import { Img } from "../../../shared/utilities/img";
import { PromotionDetailDialog } from "../../promotion/components/promotion-detail.tsx/promotion-detail-dialog";
import { ShopVoucher, ShopVoucherService } from "../../../../lib/repo/shop-voucher.repo";
import cloneDeep from "lodash/cloneDeep";
import Link from "next/link";
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
  const [voucher, setVoucher] = useState<ShopVoucher>();
  const handleClick = (banner: ShopBanner) => {
    console.log(banner);
    if (banner.voucherId) {
      ShopVoucherService.getOne({ id: banner.voucherId }).then((res) => setVoucher(cloneDeep(res)));
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
        {props.banner.map((item: ShopBanner, index) => {
          if (item.isPublic) {
            return (
              <SwiperSlide key={index} className={`cursor-pointer`}>
                {
                  {
                    PRODUCT: (
                      <Link
                        href={{
                          pathname: location.pathname,
                          query: { product: item.product?.code },
                        }}
                        shallow
                      >
                        <a>
                          <Img
                            key={index}
                            src={item.image || "/assets/default/default.png"}
                            ratio169
                            compress={512}
                          />
                        </a>
                      </Link>
                    ),
                    WEBSITE: (
                      <Link href={item.link}>
                        <a>
                          <Img
                            key={index}
                            src={item.image || "/assets/default/default.png"}
                            ratio169
                            compress={512}
                          />
                        </a>
                      </Link>
                    ),
                    VOUCHER: (
                      <div onClick={() => handleClick(item)}>
                        <Img
                          key={index}
                          src={item.image || "/assets/default/default.png"}
                          ratio169
                          compress={512}
                        />
                      </div>
                    ),
                  }[item.actionType]
                }
              </SwiperSlide>
            );
          }
        })}
      </Swiper>
      <PromotionDetailDialog
        isOpen={voucher ? true : false}
        promotion={voucher}
        onClose={() => setVoucher(null)}
      />
    </div>
  );
}
