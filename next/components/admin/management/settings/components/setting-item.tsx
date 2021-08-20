import { useRef } from "react";
import { RiLock2Line, RiMoreFill } from "react-icons/ri";
import { Setting } from "../../../../../lib/repo/setting.repo";
import { ImageInput } from "../../../../shared/utilities/form/image-input";
import { Input } from "../../../../shared/utilities/form/input";
import { Switch } from "../../../../shared/utilities/form/switch";
import { Textarea } from "../../../../shared/utilities/form/textarea";
import { Dropdown } from "../../../../shared/utilities/popover/dropdown";
import { MutableSetting } from "./setting-list";

interface PropTypes extends ReactProps {
  setting: MutableSetting;
  onChange: (setting: MutableSetting) => any;
  onEdit: (setting: Setting) => any;
  onDelete: (setting: Setting) => any;
}
export function SettingItem({ setting, ...props }: PropTypes) {
  const ref = useRef();

  const onSettingValueChanged = (value: any) => {
    props.onChange({ ...setting, value });
  };

  const onItemValueChanged = (key: string, value: string) => {
    // const index = setting.values.findIndex((x) => x.key == key);
    // if (index >= 0) {
    //   setting.values[index].value = value;
    //   setting.value = setting.values.reduce(
    //     (obj, item) => ({
    //       ...obj,
    //       [item.key]: setting.value[item.value] || "",
    //     }),
    //     {}
    //   );
    //   props.onChange({ ...setting });
    // }
    setting.value[key] = value;
    props.onChange({ ...setting });
  };
  return (
    <div className="pb-3">
      <div className="text-gray-600 font-semibold pl-1 pb-1 flex">
        <span
          className={`flex ${setting.isActive ? "" : "line-through"} ${
            setting.readOnly ? "text-gray-400" : ""
          }`}
          data-tooltip={setting.isActive ? "" : "Không hoạt động"}
        >
          {setting.name}
        </span>
        {setting.isPrivate && (
          <i className="text-xl ml-2" data-tooltip="Chế độ riêng tư">
            <RiLock2Line />
          </i>
        )}
        {/* <div
          className="h-6 pl-4 pr-2 flex items-center text-gray-600 hover:text-primary cursor-pointer ml-auto"
          ref={ref}
          onClick={(e) => e.preventDefault()}
        >
          <i className="text-2xl">
            <RiMoreFill />
          </i>
        </div>
        <Dropdown placement="right-start" reference={ref}>
          <Dropdown.Item text="Chỉnh sửa" onClick={() => props.onEdit(setting)} />
          <Dropdown.Item hoverDanger text="Xoá" onClick={() => props.onDelete(setting)} />
        </Dropdown> */}
      </div>
      {setting.desc && <div className="text-sm text-gray-500 py-2">{setting.desc}</div>}
      {
        {
          boolean: <Switch value={setting.value} onChange={onSettingValueChanged} />,
          image: (
            <ImageInput
              readonly={setting.readOnly}
              value={setting.value}
              onChange={onSettingValueChanged}
            />
          ),
          string: (
            <Input
              readonly={setting.readOnly}
              value={setting.value}
              onChange={onSettingValueChanged}
            />
          ),
          number: (
            <Input
              number
              readonly={setting.readOnly}
              value={setting.value}
              onChange={(val, extraVal) => onSettingValueChanged(extraVal)}
            />
          ),
          richText: (
            <Textarea
              readonly={setting.readOnly}
              value={setting.value}
              onChange={onSettingValueChanged}
            />
          ),
          object: (
            <>
              {Object.keys(setting.value).map((key, index, arr) => (
                <Input
                  readonly={setting.readOnly}
                  key={key}
                  value={setting.value[key]}
                  prefix={key}
                  prefixClassName="bg-gray-100 border-r border-gray-400 min-w-4xs"
                  className={`${index == 0 ? "" : "rounded-t-none"} ${
                    index == arr.length - 1 ? "" : "rounded-b-none"
                  } min-w`}
                  onChange={(val) => onItemValueChanged(key, val)}
                />
              ))}
            </>
          ),
          array: (
            <Input
              multi
              readonly={setting.readOnly}
              name={setting.name}
              value={setting.value}
              onChange={onSettingValueChanged}
            />
          ),
        }[setting.type]
      }
    </div>
  );
}
