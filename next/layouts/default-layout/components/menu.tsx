import Link from "next/link";
import { useRouter } from "next/router";
import { HiOutlineX } from "react-icons/hi";
import { Slideout } from "../../../components/shared/utilities/dialog/slideout";
import { Button } from "../../../components/shared/utilities/form/button";

export function Menu(props) {
  const router = useRouter();
  const menus = [
    { title: "Trang chủ", link: "/" },
    { title: "Danh mục", link: "/category" },
    { title: "Thống kê", link: "/2" },
    { title: "Tài khoản", link: "/account" },
  ];
  const title_page = "Trang chủ";
  return (
    <>
      <Slideout
        isOpen={props.isOpenMenu}
        onClose={() => props.setIsOpenMenu(false)}
        maxWidth="320px"
        width="84%"
        placement="left"
        className="bg-white z-500"
      >
        <div className="h-14 bg-primary flex items-center justify-between ">
          <span className="text-white text-lg font-bold px-6">Menu</span>
          <button
            className="btn-default px-0 w-10 h-10 mr-2 text-gray-100 hover:text-white hover:bg-primary-dark text-24"
            onClick={() => props.setIsOpenMenu(false)}
          >
            <i className="">
              <HiOutlineX />
            </i>
          </button>
        </div>
        <ul>
          {menus.map((menu, index) => (
            <li key={index}>
              <Link href={menu.link}>
                <a
                  className={`px-4 py-3 flex justify-between font-medium text-16 text-gray-600 hover:text-primary hover:bg-gray-50 border-b-2 border-gray-100
                      ${
                        router.pathname == menu.link
                          ? "bg-primary-light text-primary font-semibold"
                          : ""
                      }`}
                >
                  <div className="flex items-center">
                    <span>{menu.title}</span>
                  </div>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </Slideout>
      <ul className="h-full hidden items-center md:flex">
        {menus.map((item) => {
          let activated = router.pathname == item.link;
          return (
            <Link href={item.link}>
              <li
                className={` h-full flex items-center mx-6 text-sm font-semibold text-gray-600 cursor-pointer ${
                  activated && " border-b-2 border-primary text-primary "
                }`}
              >
                {item.title}
              </li>
            </Link>
          );
        })}
      </ul>
    </>
  );
}
