import React, { useState } from "react";
import { StatusTime } from "../../../shared/homepage-layout/status-time";
import { Img } from "../../../shared/utilities/img";
import { TagsDiscount } from "./tags-discount";
import { Button } from "../../../shared/utilities/form/button";
import { AiOutlineRight } from "react-icons/ai";
import Link from "next/link";

export function ShopCard() {
  return (
    <Link href="/3MSHOP">
      <a href="">
        <div className="col-span-1 bg-white rounded-sm overflow-hidden">
          <Img src="https://i.imgur.com/G8wirH3.jpg" className="w-full" ratio169 />
          <div className="flex flex-col p-2 leading-7">
            <span className="font-semibold">Phúc Long</span>
            <TagsDiscount />
            <span className="sm:text-sm text-xs mt-2">
              Cách bạn <span className="font-bold">1.4km</span>
            </span>
            <Button
              text="20 chi nhánh"
              className="text-sm px-0 justify-start"
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
