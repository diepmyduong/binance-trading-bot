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

export interface HeaderPropsType extends ReactProps {
  title?: string;
  search?: "invisible" | "show" | "hide";
  backgroundColor?: "white" | "primary";
  showAvatar?: boolean;
  code?: string;
}
export function Header({ code, ...props }: HeaderPropsType) {
  const { customer, cunstomerLogin, customerLogout, shop, shopCode } = useShopContext();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const menus = [
    // {
    //   label: "Thông tin tài khoản",
    //   icon: <FaUserAlt />,
    //   onClick: () => router.push("#"),
    // },
    // {
    //   label: "Quản lý tài khoản",
    //   icon: <HiOutlineUserCircle />,
    //   onClick: () => router.push("/"),
    // },
    {
      label: "Lịch sử đặt hàng",
      icon: <FaHistory />,
      onClick: () => router.push("/order"),
    },
    {
      label: "Khuyến mãi",
      icon: <FaPercent />,
      onClick: () => router.push("/promotion"),
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
          <Link href={`/?code=${shopCode}`}>
            <div className="flex items-center cursor-pointer">
              {shop && <Img src={shop.shopLogo || ""} className="w-10 rounded-full" />}
              <p className="text-ellipsis-2 font-semibold px-2 text-sm sm:text-base">
                {shop?.shopName}
              </p>
            </div>
          </Link>
          {!customer && <Button text="Đăng nhâp" primary small onClick={() => setIsOpen(true)} />}
          <button
            className={`btn text-primary bg-primary-light rounded-full flex items-center px-2 ${
              !customer ? "hidden" : ""
            }`}
            ref={userRef}
          >
            {/* <Img avatar src="/assets/default/avatar.png" className="w-10" /> */}
            <i className="text-20 pr-1">
              <FaUserAlt />
            </i>
            {customer}
          </button>
          <Dropdown reference={userRef}>
            {menus.map((item, index) => {
              return (
                <Dropdown.Item
                  large
                  text={item.label}
                  onClick={item.onClick}
                  key={index}
                  className="flex justify-start border-b border-gray-200 rounded-none "
                  icon={item.icon}
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
              cunstomerLogin(val);
              setIsOpen(false);
            }
          }}
        />
      </header>
    </>
  );
}
