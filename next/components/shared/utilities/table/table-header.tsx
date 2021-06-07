import { ReactNode, useRef } from "react";
import { RiMoreLine, RiRefreshLine } from "react-icons/ri";
import { Button, ButtonProps } from "../form/button";
import { Dropdown } from "../popover/dropdown";
import { useDataTable } from "./data-table";

interface PropsType extends ReactProps {}

export function TableHeader({ ...props }: PropsType) {
  return <div className="flex justify-between items-center">{props.children}</div>;
}

const Title = ({ subtitle, children }: ReactProps & { subtitle?: string }) => {
  const { title } = useDataTable();
  return (
    <div>
      <h6 className="text-xl text-gray-700 font-semibold">{children || title}</h6>
      {subtitle && <p className="text-gray-500 leading-tight">{subtitle}</p>}
    </div>
  );
};
TableHeader.Title = Title;

interface HeaderButtonProps extends ButtonProps {
  isAddButton?: boolean;
  isDeleteButton?: boolean;
  isRefreshButton?: boolean;
  refreshAfterTask?: boolean;
  moreItems?: ((ButtonProps & { refreshAfterTask?: boolean }) | "divider")[];
}
const HeaderButton = ({
  isAddButton,
  isDeleteButton,
  isRefreshButton,
  refreshAfterTask,
  moreItems,
  className = "",
  iconClassName = "",
  ...props
}: HeaderButtonProps) => {
  const { refreshing, itemName, onRefresh, onCreateItem, createItemHref, loadAll } = useDataTable();
  const ref = useRef();

  let icon = props.icon;
  if (!icon) {
    if (moreItems) {
      icon = <RiMoreLine />;
    } else if (isRefreshButton) {
      icon = <RiRefreshLine />;
    }
  }

  return (
    <>
      <Button
        {...props}
        className={`${props.text || isAddButton ? "px-5" : "px-3"} ${className}`}
        innerRef={props.innerRef || ref}
        icon={icon}
        iconClassName={`text-xl ${isRefreshButton && refreshing ? "animate-spin" : ""}`}
        href={props.href || (isAddButton && createItemHref ? createItemHref() : undefined)}
        disabled={isRefreshButton && refreshing}
        text={props.text || (isAddButton ? `Tạo ${itemName}` : "")}
        onClick={async (e) => {
          try {
            if (props.onClick) await props.onClick(e);
            if (isRefreshButton) onRefresh();
            if (isAddButton) onCreateItem();
            if (refreshAfterTask) await loadAll(true);
          } catch (err) {}
        }}
      />
      {moreItems && (
        <Dropdown reference={props.innerRef || ref}>
          {moreItems.map((item, index) =>
            item == "divider" ? (
              <Dropdown.Divider key={index} />
            ) : (
              <Dropdown.Item
                key={index}
                {...item}
                onClick={async (e) => {
                  try {
                    if (item.onClick) await item.onClick(e);
                    if (item.refreshAfterTask) await loadAll(true);
                  } catch (err) {}
                }}
              />
            )
          )}
        </Dropdown>
      )}
    </>
  );
};
TableHeader.Button = HeaderButton;

const HeaderButtons = ({ children }: ReactProps) => <div className="flex gap-x-2">{children}</div>;
TableHeader.Buttons = HeaderButtons;
