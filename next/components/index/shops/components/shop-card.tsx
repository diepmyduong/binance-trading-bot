import React, { useState } from "react";
import { StatusTime } from "../../../shared/homepage-layout/status-time";
import { Img } from "../../../shared/utilities/img";
import { TagsDiscount } from "./tags-discount";
import { Button } from "../../../shared/utilities/form/button";
import { AiOutlineRight } from "react-icons/ai";
import Link from "next/link";
import { PublicShop } from "../../../../lib/repo/shop.repo";
interface PropsType extends ReactProps {
  shop: PublicShop;
}
export function ShopCard({ shop, ...props }: PropsType) {
  return (
    <Link href={`/${shop.shopCode}`}>
      <a href="">
        <div className="bg-white rounded-sm overflow-hidden flex">
          <Img src={shop.coverImage} className="w-28 sm:w-40" />
          <div className="flex flex-col p-2 leading-7 flex-1">
            <span className="font-semibold text-ellipsis-2">{shop.name}</span>
            {/* <TagsDiscount /> */}
            <span className="sm:text-sm text-xs mt-2">
              Cách bạn <span className="font-bold">{shop.distance}km</span>
            </span>
            <Button
              text="20 chi nhánh"
              className="text-sm px-0 justify-start mb-0 mt-auto"
              textPrimary
              icon={<AiOutlineRight />}
              iconPosition="end"
            />
          </div>
        </div>
      </a>
    </Link>
  );
}
