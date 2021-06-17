import Link from "next/link";
import React, { useState } from "react";
import { Img } from "../../../components/shared/utilities/img";
import { useRef } from "react";
import { Dropdown } from "../../../components/shared/utilities/popover/dropdown";
import { useRouter } from "next/router";
import { FaHistory, FaPercent, FaSignInAlt, FaUserAlt } from "react-icons/fa";
import { useShopContext } from "../../../lib/providers/shop-provider";
import { Spinner } from "../../../components/shared/utilities/spinner";

export interface HeaderPropsType extends ReactProps {
  title?: string;
  search?: "invisible" | "show" | "hide";
  backgroundColor?: "white" | "primary";
  showAvatar?: boolean;
}
export function Header({ ...props }: HeaderPropsType) {
  const { shop } = useShopContext();
  // const [isOpenMenu, setIsOpenMenu] = useState(false);
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
          {(shop && (
            <Link href="/">
              <Img src={shop.shopLogo || ""} className="h-10 w-10" />
            </Link>
          )) || <Spinner />}
          {/* <Menu isOpenMenu={isOpenMenu} setIsOpenMenu={setIsOpenMenu} /> */}
          {/* <div className="">
            <Button href="/quotation" text="Tạo báo giá" accent small />
          </div> */}
          <button className="btn px-2" ref={userRef}>
            <Img avatar src="/assets/default/avatar.png" className="w-10" />
          </button>
          <Dropdown reference={userRef}>
            <Dropdown.Item>
              <div className="w-full font-semibold text-center">086 9698 360</div>
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
      </header>
    </>
  );
}
