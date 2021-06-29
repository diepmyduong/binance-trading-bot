import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
  RiArrowRightSLine,
  RiLogoutBoxRLine,
  RiNotification3Line,
  RiUser3Fill,
} from "react-icons/ri";
import { Button } from "../../../components/shared/utilities/form/button";
import { Img } from "../../../components/shared/utilities/img";
import { Dropdown } from "../../../components/shared/utilities/popover/dropdown";
import { Popover } from "../../../components/shared/utilities/popover/popover";
import { useAuth } from "../../../lib/providers/auth-provider";

interface PropsType extends ReactProps {}
export function Header({ ...props }: PropsType) {
  const userRef = useRef();
  const notificationRef = useRef();
  const { member, logoutMember } = useAuth();

  return (
    <>
      <div className="top-0 left-0 fixed w-full h-14 bg-white z-50 shadow flex items-center">
        <Link href="/">
          <a className="block py-3 px-6 h-full">
            <img className="w-auto h-full object-contain" src="/assets/img/logo.png" />
          </a>
        </Link>

        <div className="ml-auto" ref={notificationRef}>
          <Button icon={<RiNotification3Line />} />
        </div>
        <Popover placement="bottom" reference={notificationRef}>
          <div className="items flex flex-wrap p-8">Thông báo</div>
        </Popover>
        {member && (
          <div
            className="flex items-center pl-4 pr-8 border-l border-gray-100 cursor-pointer group"
            ref={userRef}
          >
            <Img compress={80} avatar className="w-8" src={member.avatar} alt="avatar" />
            <div className="pl-2 whitespace-nowrap">
              <div className="font-semibold text-gray-700 group-hover:text-primary leading-4 mb-1">
                {member.name}
              </div>
              <div className="text-sm text-gray-600 group-hover:text-primary leading-3">
                {member.email}
              </div>
            </div>
          </div>
        )}

        <Dropdown reference={userRef}>
          <Dropdown.Item
            icon={<RiUser3Fill />}
            text="Hồ sơ"
            href={{ pathname: "/shop/settings" }}
          />
          <Dropdown.Divider />
          <Dropdown.Item
            hoverDanger
            icon={<RiLogoutBoxRLine />}
            text="Đăng xuất"
            onClick={logoutMember}
          />
        </Dropdown>
      </div>
    </>
  );
}
