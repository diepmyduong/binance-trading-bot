import { SubMenu } from "./submenu";
import { useEffect, useMemo, useState } from "react";
import {
  RiArchiveDrawerLine,
  RiArchiveLine,
  RiArrowDownSLine,
  RiDashboard2Line,
  RiFileList3Line,
  RiHistoryLine,
  RiMailSettingsLine,
  RiNewspaperLine,
  RiPagesLine,
  RiSettings3Line,
  RiUser2Line,
} from "react-icons/ri";
import { Accordion } from "../../../components/shared/utilities/accordion/accordion";
import { Button } from "../../../components/shared/utilities/form/button";
import { useRouter } from "next/router";
import { Footer } from "./footer";

interface PropsType extends ReactProps {}
export default function Sidebar({ ...props }: PropsType) {
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
          className="bg-white shadow w-60 fixed top-14 flex flex-col"
          style={{ height: "calc(100vh - 56px)" }}
        >
          <div className="flex-1 v-scrollbar pt-6 pb-3">
            {menus.map((menu, index) => (
              <div className="mb-2" key={index}>
                <div className="flex py-2 px-4 group" onClick={() => toggleMenu(index)}>
                  {/* <i className="text-lg w-5 h-5 text-primary group-hover:text-primary-dark">
                  {menu.icon}
                </i> */}
                  <span className="flex-1 px-2 text-gray-700 font-semibold uppercase">
                    {menu.title}
                  </span>
                  {/* <i
                  className={`text-lg text-gray-700 group-hover:text-primary self-center transform transition ${
                    menu.isOpen ? "rotate-180" : ""
                  }`}
                >
                  <RiArrowDownSLine />
                </i> */}
                </div>
                <Accordion isOpen={true}>
                  {menu.submenus.map((submenu, index) => (
                    <Button
                      key={index}
                      accent={router.pathname.includes(submenu.path)}
                      className={`w-full pl-10 pr-0 justify-start font-normal rounded-none ${
                        router.pathname.includes(submenu.path) ? "" : "hover:bg-gray-100"
                      }`}
                      icon={submenu.icon}
                      href={submenu.path}
                      text={submenu.title}
                    />
                  ))}
                </Accordion>
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
        title: "Bảng điều khiển",
        path: "/admin/management/dashboard",
        icon: <RiDashboard2Line />,
      },
      {
        title: "Tài khoản",
        path: "/admin/management/users",
        icon: <RiUser2Line />,
      },
      {
        title: "Cấu hình",
        path: "/admin/management/settings",
        icon: <RiSettings3Line />,
      },
      {
        title: "Lịch sử thao tác",
        path: "/admin/management/activity",
        icon: <RiHistoryLine />,
      },
    ],
  },
  {
    title: "Sản phẩm",
    submenus: [
      // {
      //   title: "Nhóm sản phẩm",
      //   path: "/admin/products/groups",
      //   icon: <RiArchiveDrawerLine />,
      // },
      {
        title: "Sản phẩm",
        path: "/admin/products",
        icon: <RiArchiveLine />,
      },
    ],
  },
  {
    title: "Báo giá",
    submenus: [
      {
        title: "Lịch sử báo giá",
        path: "/admin/quotations",
        icon: <RiPagesLine />,
      },
    ],
  },
  {
    title: "Truyền thông",
    submenus: [
      {
        title: "Biểu mẫu",
        path: "/admin/marketing/forms",
        icon: <RiFileList3Line />,
      },
      {
        title: "Bài viết",
        path: "/admin/marketing/posts",
        icon: <RiNewspaperLine />,
      },
      {
        title: "Email",
        path: "/admin/marketing/email",
        icon: <RiMailSettingsLine />,
      },
    ],
  },
];
