import React, { useState } from "react";
import { ShopCard } from "./components/shop-card";
import Link from "next/link";
import { Img } from "../../shared/utilities/img";

export function ShopsPage() {
  return (
    <div className="flex flex-col min-h-screen relative bg-gray-800">
      <header className={`fixed top-0 w-full z-100`}>
        <div className="w-full mx-auto h-14 flex justify-between items-center max-w-lg shadow bg-white px-4">
          <Link href={`/`}>
            <a className="flex items-center cursor-pointer w-full">
              <Img src="/assets/img/logo-som.png" className="w-10" />
              <span className="text-ellipsis font-semibold px-2 text-sm sm:text-base flex-1 uppercase text-center mr-10">
                Giaohang.shop
              </span>
            </a>
          </Link>
        </div>
      </header>
      <div className="w-full bg-gray-100 relative min-h-screen grid grid-cols-2 gap-4 p-4 pt-14 max-w-lg mx-auto">
        {shops.map((item, index) => (
          <ShopCard key={index} />
        ))}
      </div>
    </div>
  );
}
const shops = [
  "123123",
  "123123",
  "123123",
  "123123",
  "123123",
  "123123",
  "123123",
  "123123",
  "123123",
  "123123",
  "123123",
];
