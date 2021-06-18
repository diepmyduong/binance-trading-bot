import Link from "next/link";
import React, { useState } from "react";
import { Img } from "../../../components/shared/utilities/img";
import { useRef } from "react";
import { Dropdown } from "../../../components/shared/utilities/popover/dropdown";
import { useRouter } from "next/router";
import { FaHistory, FaPercent, FaSignInAlt, FaUserAlt } from "react-icons/fa";
import { useShopContext } from "../../../lib/providers/shop-provider";
import { Spinner } from "../../../components/shared/utilities/spinner";
import { Button } from "../../../components/shared/utilities/form/button";
import { useAuth } from "../../../lib/providers/auth-provider";
import CustomerLoginDialog from "../../../components/shared/utilities/dialog/customer-login-dialog";
import { HiUserCircle } from "react-icons/hi";

export interface HeaderPropsType extends ReactProps {
  title?: string;
  search?: "invisible" | "show" | "hide";
  backgroundColor?: "white" | "primary";
  showAvatar?: boolean;
}
export function Header({ ...props }: HeaderPropsType) {
  const { shop, customer, cunstomerLogin, customerLogout } = useShopContext();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const menus = [
    {
      label: "Thông tin tài khoản",
      icon: <FaUserAlt />,
      onClick: () => router.push("#"),
    },
    // {
    //   label: "Quản lý tài khoản",
    //   icon: <HiOutlineUserCircle />,
    //   onClick: () => router.push("/"),
    // },
    {
      label: "Lịch sử đặt hàng",
      icon: <FaHistory />,
      onClick: () => router.push("#"),
    },
    {
      label: "Khuyến mãi",
      icon: <FaPercent />,
      onClick: () => router.push("#"),
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
      <header className={`fixed top-0 w-screen  z-100`}>
        <div className="main-container h-14 flex justify-between items-center max-w-lg shadow bg-white px-4">
          {(shop && (
            <Link href="/">
              <img src={shop.shopLogo || ""} className="h-10 w-10 object-contain" />
            </Link>
          )) || <Spinner />}
          {!customer && <Button text="Đăng nhâp" primary small onClick={() => setIsOpen(true)} />}
          <button className={`btn px-2 ${!customer ? "hidden" : ""}`} ref={userRef}>
            {/* <Img avatar src="/assets/default/avatar.png" className="w-10" /> */}
            <i className="text-40">
              <HiUserCircle />
            </i>
          </button>
          <Dropdown reference={userRef}>
            <Dropdown.Item>
              <div className="w-full font-semibold text-center">{customer}</div>
            </Dropdown.Item>
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
