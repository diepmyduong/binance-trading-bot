import Link from "next/link";
import React, { useState } from "react";
import { HiChevronRight, HiShoppingCart } from "react-icons/hi";
import { Button } from "../../../components/shared/utilities/form/button";
import { Menu } from "./menu";
import { Img } from "../../../components/shared/utilities/img";
import { useRef } from "react";
import { Dropdown } from "../../../components/shared/utilities/popover/dropdown";
import { useRouter } from "next/router";

export interface HeaderPropsType extends ReactProps {
  title?: string;
  search?: "invisible" | "show" | "hide";
  backgroundColor?: "white" | "primary";
  showAvatar?: boolean;
}
export function Header({ ...props }: HeaderPropsType) {
  // const [isOpenMenu, setIsOpenMenu] = useState(false);
  const router = useRouter();
  const menus = [
    {
      label: "Thông tin tài khoản",
      onClick: () => router.push("#"),
    },
    // {
    //   label: "Quản lý tài khoản",
    //   icon: <HiOutlineUserCircle />,
    //   onClick: () => router.push("/"),
    // },
    {
      label: "Lịch sử đặt hàng",
      onClick: () => router.push("#"),
    },
    {
      label: "Khuyến mãi",
      onClick: () => router.push("#"),
    },
    {
      label: "Đăng xuất",
      // onClick: () => logout(),
    },
  ];
  const userRef = useRef<any>();
  return (
    <>
      <header className={`fixed top-0 w-screen shadow z-200 bg-white`}>
        <div className="main-container h-14 flex justify-between items-center">
          {/* <Button
            onClick={() => {
              setIsOpenMenu(true);
            }}
            className=" px-0"
          >
            <i className="text-2xl text-gray-600 md:hidden ">
              <HiMenu />
            </i>
          </Button> */}
          <Link href="/">
            <button className="flex-1 flex justify-start items-center md:ml-0">
              <img src="/assets/img/logo.png" className="h-10 p-2" />
              <img src="/assets/img/logoBanner.png" className="h-5 p-1" />
            </button>
          </Link>
          {/* <Menu isOpenMenu={isOpenMenu} setIsOpenMenu={setIsOpenMenu} /> */}
          {/* <div className="">
            <Button href="/quotation" text="Tạo báo giá" accent small />
          </div> */}
          <button className="btn px-2" ref={userRef}>
            <Img avatar src="/assets/default/avatar.png" className="w-10" />
          </button>
          <Dropdown reference={userRef}>
            <Dropdown.Avatar
              avatar
              src="/assets/default/avatar.png"
              className=" w-24 h-24 "
              text="0927244741"
            />
            {menus.map((item, index) => {
              return (
                <Dropdown.Item
                  large
                  text={item.label}
                  onClick={item.onClick}
                  key={index}
                  iconPosition="end"
                  icon={<HiChevronRight />}
                />
              );
            })}
          </Dropdown>
        </div>
      </header>
    </>
  );
}
