import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/shared/utilities/form/button";
import { Img } from "../../../components/shared/utilities/img";
import { useAuth } from "../../../lib/providers/auth-provider";
import {
  IconCollaborator,
  IconComment,
  IconCustomer,
  IconDiscount,
  IconDriver,
  IconEmployee,
  IconHome,
  IconMenu,
  IconOrder,
  IconPosition,
  IconReport,
  IconSelection,
  IconSettings,
} from "../../../lib/svg";
import { Footer } from "./footer";

interface PropsType extends ReactProps {}
export default function Sidebar({ ...props }: PropsType) {
  const { member, logoutMember } = useAuth();
  const [menus, setMenus] = useState<any[]>(SIDEBAR_MENUS);
  const router = useRouter();

  const toggleMenu = (index) => {
    menus[index].isOpen = !menus[index].isOpen;
    setMenus([...menus]);
  };

  useEffect(() => {
    menus.forEach((menu) => {
      if (router.pathname.includes(menu.path)) menu.isOpen = true;
    });
    setMenus([...menus]);
  }, []);

  return useMemo(
    () => (
      <>
        <div
          className="bg-white shadow w-60 fixed top-0 flex flex-col"
          style={{ height: "calc(100vh)" }}
        >
          <div className="flex items-start pt-6 px-4">
            {member.shopLogo && <Img className="w-12 rounded-full" src={member.shopLogo} />}
            <div className="pl-3 flex-1">
              <div className="text-gray-800 font-semibold text-ellipsis-2 leading-tight">
                {member.shopName}
              </div>
              <Button
                className="mb-1 text-sm px-0 h-8"
                text="Đăng xuất"
                hoverDanger
                onClick={logoutMember}
              />
            </div>
          </div>
          <div className="flex-1 v-scrollbar pt-1 pb-3">
            {menus.map((menu, index) => (
              <div className="mb-2" key={index}>
                {/* <div className="flex py-2 px-4 group" onClick={() => toggleMenu(index)}> */}
                {/* <i className="text-lg w-5 h-5 text-primary group-hover:text-primary-dark">
                  {menu.icon}
                </i> */}
                {/* <span className="flex-1 px-2 text-gray-700 font-semibold uppercase">
                    {menu.title}
                  </span> */}
                {/* <i
                  className={`text-lg text-gray-700 group-hover:text-primary self-center transform transition ${
                    menu.isOpen ? "rotate-180" : ""
                  }`}
                >
                  <RiArrowDownSLine />
                </i> */}
                {/* </div> */}
                {/* <Accordion isOpen={true}> */}
                {menu.submenus.map((submenu, index) => (
                  <Button
                    key={index}
                    accent={router.pathname.includes(submenu.path)}
                    className={`h-11 mt-1 w-full pl-6 pr-0 justify-start rounded-none ${
                      router.pathname.includes(submenu.path)
                        ? "bg-gradient-to-r from-accent to-primary"
                        : "hover:bg-primary-light"
                    }`}
                    iconClassName="transform scale-95 mr-2.5"
                    icon={submenu.icon(router.pathname.includes(submenu.path))}
                    href={submenu.path}
                    text={submenu.title}
                  />
                ))}
                {/* </Accordion> */}
              </div>
            ))}
          </div>
          <Footer />
        </div>
      </>
    ),
    [menus, router.pathname]
  );
}

export const SIDEBAR_MENUS = [
  {
    title: "Quản trị",
    submenus: [
      {
        title: "Tổng quan",
        path: "/shop/dashboard",
        icon: (active: boolean) => <IconHome hasGradient={!active} />,
      },
      {
        title: "Đơn hàng",
        path: "/shop/orders",
        icon: (active: boolean) => <IconOrder hasGradient={!active} />,
      },
      {
        title: "Chi nhánh",
        path: "/shop/branches",
        icon: (active: boolean) => <IconPosition hasGradient={!active} />,
      },
      {
        title: "Món",
        path: "/shop/products",
        icon: (active: boolean) => <IconMenu hasGradient={!active} />,
      },
      {
        title: "Topping",
        path: "/shop/toppings",
        icon: (active: boolean) => <IconSelection hasGradient={!active} />,
      },
      {
        title: "Khuyến mãi",
        path: "/shop/vouchers",
        icon: (active: boolean) => <IconDiscount hasGradient={!active} />,
      },
      {
        title: "Khách hàng",
        path: "/shop/customers",
        icon: (active: boolean) => <IconCustomer hasGradient={!active} />,
      },
      // {
      //   title: "Báo cáo",
      //   path: "/shop/reports",
      //   icon: (active: boolean) => <IconReport hasGradient={!active} />,
      // },
      {
        title: "Tài xế nội bộ",
        path: "/shop/drivers",
        icon: (active: boolean) => <IconDriver hasGradient={!active} />,
      },
      {
        title: "Nhân viên",
        path: "/shop/staffs",
        icon: (active: boolean) => <IconEmployee hasGradient={!active} />,
      },
      {
        title: "Cộng tác viên",
        path: "/shop/collaborators",
        icon: (active: boolean) => <IconCollaborator hasGradient={!active} />,
      },
      {
        title: "Bình luận",
        path: "/shop/comments",
        icon: (active: boolean) => <IconComment hasGradient={!active} />,
      },
      {
        title: "Cấu hình cửa hàng",
        path: "/shop/settings",
        icon: (active: boolean) => <IconSettings hasGradient={!active} />,
      },
    ],
  },
];
