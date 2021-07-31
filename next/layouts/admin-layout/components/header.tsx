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
  const [linkAdress, setlinkAdress] = useState([]);
  var arr = [];
  const { pathname } = useRouter();
  const { user, logout } = useAuth();
  // useEffect(() => {
  //   SidebarData.forEach((item, index) => {
  //     if (pathname.search(item.path) > -1) {
  //       var link = {
  //         title: item.title,
  //         path: item.path,
  //       };
  //       arr.push(link);
  //       setlinkAdress([...arr]);
  //       item.subMenus.forEach((item, index) => {
  //         if (item.path == pathname) {
  //           var link = {
  //             title: item.title,
  //             path: item.path,
  //           };
  //           arr.push(link);
  //           setlinkAdress([...arr]);
  //         }
  //       });
  //     }
  //   });
  // }, []);

  return (
    <>
      <div className="top-0 left-0 fixed w-full h-14 bg-white z-50 shadow flex items-center">
        <Link href="/">
          <a className="flex py-3 px-6 h-full uppercase font-bold text-xl text-primary items-center">
            <img className="w-auto h-full object-contain" src="/assets/img/logo-som.png" />
            <div className="ml-4">3M Marketing</div>
          </a>
        </Link>
        {/* <div className=" w-full h-full flex items-center space-x-4">
          {(breadcrumbs || linkAdress)
            .map((item, index, array) => {
              const isActive = index == array.length - 1;
              return (
                <div
                  className={`${
                    isActive
                      ? "text-gray-800 font-semibold"
                      : "text-gray-500 hover:text-gray-800 hover:underline"
                  }`}
                  key={item.path + index}
                >
                  <Link href={item.path}>{item.title}</Link>
                </div>
              );
            })
            .reduce((accu, elem, index): any => {
              return accu === null
                ? [elem]
                : [
                    ...accu,
                    <i key={index} className="text-lg text-gray-400">
                      <RiArrowRightSLine />
                    </i>,
                    elem,
                  ];
            }, null as any)}
        </div> */}

        {/* <div className="ml-auto" ref={notificationRef}>
          <Button icon={<RiNotification3Line />} />
        </div>
        <Popover placement="bottom" reference={notificationRef}>
          <div className="items flex flex-wrap p-8">Thông báo</div>
        </Popover> */}
        {user && (
          <div
            className="flex items-center pl-4 pr-8 border-l border-gray-100 cursor-pointer group ml-auto"
            ref={userRef}
          >
            <Img compress={80} avatar className="w-8" src={user.profilePicture} alt="avatar" />
            <div className="pl-2 whitespace-nowrap">
              <div className="font-semibold text-gray-700 group-hover:text-primary leading-4 mb-1">
                {user.name}
              </div>
              <div className="text-sm text-gray-600 group-hover:text-primary leading-3">
                {user.email}
              </div>
            </div>
          </div>
        )}

        <Dropdown reference={userRef}>
          <Dropdown.Item
            icon={<RiUser3Fill />}
            text="Hồ sơ"
            href={{ pathname: "/admin/manager/users/" + user.id }}
          />
          <Dropdown.Divider />
          <Dropdown.Item
            hoverDanger
            icon={<RiLogoutBoxRLine />}
            text="Đăng xuất"
            onClick={logout}
          />
        </Dropdown>
      </div>
    </>
  );
}
