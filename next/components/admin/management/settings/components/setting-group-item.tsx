import Link from "next/link";
import { useRef } from "react";
import { RiMore2Fill } from "react-icons/ri";
import { SettingGroup } from "../../../../../lib/repo/setting-group.repo";
import { Dropdown } from "../../../../shared/utilities/popover/dropdown";

interface PropTypes extends ReactProps {
  settingGroup: SettingGroup;
  onEdit: (settingGroup: SettingGroup) => any;
  onDelete: (settingGroup: SettingGroup) => any;
}
export function SettingGroupItem(props: PropTypes) {
  const href = `/admin/management/settings/${encodeURIComponent(props.settingGroup.slug)}`;
  const isActive = location.pathname == href;
  const ref = useRef();

  return (
    <Link href={href}>
      <a
        className={`relative flex flex-col pl-4 pr-2 py-2 text-gray-600 group border-b border-gray-200}`}
        // data-tooltip={props.settingGroup.desc}
        // data-placement="right"
      >
        {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>}
        <div className="flex justify-between items-center">
          <strong className={`group-hover:text-primary ${isActive && "text-primary"}`}>
            {props.settingGroup.name}
          </strong>
          {/* <div
            className="h-8 pl-4 pr-1 flex items-center text-gray-600 hover:text-primary cursor-pointer"
            ref={ref}
            onClick={(e) => e.preventDefault()}
          >
            <i className="text-2xl">
              <RiMore2Fill />
            </i>
          </div>
          <Dropdown placement="right-start" reference={ref}>
            <Dropdown.Item text="Chỉnh sửa" onClick={() => props.onEdit(props.settingGroup)} />
            <Dropdown.Item
              hoverDanger
              text="Xoá"
              onClick={() => props.onDelete(props.settingGroup)}
            />
          </Dropdown> */}
        </div>
        {props.settingGroup.desc && (
          <div className="text-gray-500 text-sm">{props.settingGroup.desc}</div>
        )}
      </a>
    </Link>
  );
}
