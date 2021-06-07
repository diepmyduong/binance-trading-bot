import Link from "next/link";
import { useState } from "react";
import { HiMenu } from "react-icons/hi";
import { Button } from "../../../components/shared/utilities/form/button";
import { Menu } from "./menu";

export interface HeaderPropsType extends ReactProps {
  title?: string;
  search?: "invisible" | "show" | "hide";
  backgroundColor?: "white" | "primary";
  showAvatar?: boolean;
}
export function Header({ ...props }: HeaderPropsType) {
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  return (
    <>
      <header className={`fixed top-0 w-screen shadow z-200 bg-white`}>
        <div className="main-container h-14 flex justify-between items-center">
          <Button
            onClick={() => {
              setIsOpenMenu(true);
            }}
            className=" px-0"
          >
            <i className="text-2xl text-gray-600 md:hidden ">
              <HiMenu />
            </i>
          </Button>
          <button className="flex-1 flex justify-start md:ml-0">
            <Link href="/">
              <img src="/assets/img/logo.png" className="h-10 p-2" />
            </Link>
          </button>
          <Menu isOpenMenu={isOpenMenu} setIsOpenMenu={setIsOpenMenu} />
          <div className="">
            <Button href="/quotation" text="Tạo báo giá" accent small />
          </div>
        </div>
      </header>
    </>
  );
}
