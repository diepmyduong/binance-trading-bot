import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type SubMenuProps = {
  [x: string]: any;
  opened?: boolean;
  activeSubmenu?: string;
};
export function SubMenu({ opened, activeSubmenu, item, ...props }: SubMenuProps) {
  const { pathname } = useRouter();
  const [Open, setOpen] = useState(opened || pathname.includes(item.path));
  const open = () => {
    setOpen(!Open);
  };
  useEffect(() => {
    setOpen(opened);
  }, [opened]);
  return (
    <>
      <li className=" py-2 items-center cursor-pointer" onClick={open}>
        <div className="px-4 py-2 flex items-center hover:text-primary-dark">
          <div className="icon w-5 h-5 mr-3 text-primary">{item.icon}</div>
          <span className="font-bold text-gray-500 text-sm ">{item.title}</span>
          <span className="flex-auto"></span>
          <i
            className={
              Open
                ? "duration-300 sidebar-menu-item-collapse w-4 h-4 transform rotate-180"
                : "duration-300 sidebar-menu-item-collapse w-4 h-4 transform rotate-0 focus:rotate-0"
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              className="fill-current arrow"
            >
              <path d="M8 6.81l3.97 3.97a.75.75 0 0 0 1.06-1.06l-4.5-4.5a.75.75 0 0 0-1.06 0l-4.5 4.5a.75.75 0 0 0 1.06 1.06L8 6.81z"></path>
            </svg>
          </i>
        </div>
        <ul className={"text-sm transition-all duration-300 " + (!Open && " opacity-0 invisible ")}>
          {Open &&
            item.subMenus.map((item, index) => {
              const activated = activeSubmenu == item.title || item.path == pathname;
              return (
                <Link href={item.path} key={index} shallow={true}>
                  <li className={"flex w-full " + (activated && "bg-accent text-white")}>
                    <span
                      className={
                        "pl-14 flex space-y-6 py-2 transition-all duration-200 hover:text-primary text-gray-400" +
                        (activated && "bg-accent text-white font-semibold")
                      }
                    >
                      {item.title}
                    </span>
                  </li>
                </Link>
              );
            })}
        </ul>
      </li>
    </>
  );
}
