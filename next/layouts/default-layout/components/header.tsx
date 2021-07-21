import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { Dropdown } from "../../../components/shared/utilities/popover/dropdown";
import { useRouter } from "next/router";
import { FaHistory, FaPercent, FaSignInAlt, FaUserAlt } from "react-icons/fa";
import { useShopContext } from "../../../lib/providers/shop-provider";
import { Button } from "../../../components/shared/utilities/form/button";
import { useAuth } from "../../../lib/providers/auth-provider";
import { CustomerLoginDialog } from "../../../components/shared/homepage-layout/customer-login-dialog";
import { HiOutlineUserCircle } from "react-icons/hi";
import { Img } from "../../../components/shared/utilities/img";
import { useDefaultLayoutContext } from "../provider/default-layout-provider";

export interface HeaderPropsType extends ReactProps {
  title?: string;
  search?: "invisible" | "show" | "hide";
  backgroundColor?: "white" | "primary";
  showAvatar?: boolean;
  code?: string;
}
export function Header({ code, ...props }: HeaderPropsType) {
  const { customer, customerLogin, customerLogout, shop, shopCode } = useShopContext();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const menus = [
    {
      label: "Thông tin tài khoản",
      icon: <FaUserAlt />,
      href: `/${shopCode}/customer`,
    },
    // {
    //   label: "Quản lý tài khoản",
    //   icon: <HiOutlineUserCircle />,
    //   onClick: () => router.push("/"),
    // },
    {
      label: "Lịch sử đặt hàng",
      icon: <FaHistory />,
      href: `/${shopCode}/order`,
    },
    {
      label: "Khuyến mãi",
      icon: <FaPercent />,
      href: `/${shopCode}/promotion`,
    },
    {
      label: "Đăng xuất",
      icon: <FaSignInAlt />,
      onClick: () => customerLogout(),
    },
  ];
  const userRef = useRef<any>();
  return (
    <>
      <header className={`fixed top-0 w-full z-100`}>
        <div className="w-full mx-auto h-14 flex justify-between items-center max-w-lg shadow bg-white px-4">
          <Link href={`/${shopCode}`}>
            <a className="flex items-center cursor-pointer">
              {shop && <Img src={shop.shopLogo || ""} className="w-10 rounded-full" />}
              <p className="text-ellipsis font-semibold px-2 text-sm sm:text-base">
                {shop?.shopName}
              </p>
            </a>
          </Link>
          {!customer && (
            <Button
              text="Đăng nhâp"
              className="whitespace-nowrap"
              primary
              small
              onClick={() => setIsOpen(true)}
            />
          )}
          <button
            className={`btn text-primary bg-primary-light rounded-full flex items-center px-2 ${
              !customer ? "hidden" : ""
            }`}
            ref={userRef}
          >
            {/* <Img avatar src="/assets/default/avatar.png" className="w-10" /> */}
            <i className="text-18 pr-1">
              <FaUserAlt />
            </i>
          </button>
          <Dropdown reference={userRef}>
            {menus.map((item, index) => {
              return (
                <Dropdown.Item
                  large
                  text={item.label}
                  onClick={item.onClick}
                  key={index}
                  className={`flex justify-start border-b border-gray-200 rounded-none`}
                  icon={item.icon}
                  href={item.href}
                />
              );
            })}
          </Dropdown>
        </div>
        <CustomerLoginDialog
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={(val) => {
            if (val) {
              customerLogin(val);
              setIsOpen(false);
            }
          }}
        />
      </header>
    </>
  );
}
