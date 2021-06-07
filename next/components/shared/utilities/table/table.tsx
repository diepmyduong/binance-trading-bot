import formatDate from "date-fns/format";
import { Children, MouseEvent, useEffect, useRef, useState } from "react";
import { RiDeleteBinLine, RiEdit2Line, RiMore2Line } from "react-icons/ri";
import { NumberPipe } from "../../../../lib/pipes/number";
import { BaseModel } from "../../../../lib/repo/crud.repo";
import { Button, ButtonProps } from "../form/button";
import { Img, ImgProps } from "../img";
import { NotFound } from "../not-found";
import { Dropdown } from "../popover/dropdown";
import { Spinner } from "../spinner";
import { useDataTable } from "./data-table";
import { RiArrowUpLine, RiArrowDownLine } from "react-icons/ri";

interface TableProps extends ReactProps {
  items?: BaseModel[];
}

export function Table({ className = "", style = {}, ...props }: TableProps) {
  const {
    itemName,
    items,
    selection,
    selectedItems,
    setSelectedItems,
    onUpdateItem,
    currentOrder,
    setCurrentOrder,
  } = useDataTable();
  const [tableItems, setTableItems] = useState<BaseModel[]>(undefined);

  const columnComponents = Children.map(props.children, (child) =>
    child?.type?.displayName === "Column" ? { child } : null
  );
  const columns = (columnComponents?.map((col) => col.child.props) || []) as ColumnProps[];

  const children = Children.map(props.children, (child) =>
    !child?.type?.displayName ? { child } : null
  );

  useEffect(() => {
    setTableItems(items || props.items);
  }, [items, props.items]);

  const onItemClick = (item: BaseModel) => {
    if (selection == "single") {
      setSelectedItems([item]);
    } else if (selection == "multi") {
      let index = selectedItems.findIndex((x) => x.id == item.id);
      if (index >= 0) {
        selectedItems.splice(index, 1);
      } else {
        selectedItems.push(item);
      }
      setSelectedItems([...selectedItems]);
    }
  };

  const onDoubleClick = (e: MouseEvent, item) => {
    if (e.detail != 2) return;
    else {
      onUpdateItem(item);
    }
  };

  const onHeaderClick = (col: ColumnProps) => {
    if (col.orderBy) {
      if (currentOrder && currentOrder.property == col.orderBy) {
        switch (currentOrder.type) {
          case "asc": {
            setCurrentOrder({ property: col.orderBy, type: "desc" });
            break;
          }
          case "desc": {
            setCurrentOrder(null);
            break;
          }
        }
      } else {
        setCurrentOrder({ property: col.orderBy, type: "asc" });
      }
    }
  };

  return (
    <table className={`w-full border-l border-r border-collapse ${className}`} style={{ ...style }}>
      <thead>
        <tr className="uppercase text-sm font-semibold bg-gray-50 text-gray-600 border-b border-t">
          {columns.map((col, index, arr) => (
            <th
              onClick={() => onHeaderClick(col)}
              key={index}
              className={`py-3 ${
                index == 0 ? "pl-3 pr-2" : index == arr.length - 1 ? "pl-2 pr-3" : "px-2"
              } ${col.orderBy ? "cursor-pointer hover:text-primary hover:bg-gray-100" : ""}`}
              style={{ width: col.width ? col.width + "px" : "auto" }}
            >
              <div
                className={`flex items-center ${
                  col.center ? "justify-center" : col.right ? "justify-right" : "justify-left"
                }`}
              >
                {col.orderBy && col.orderBy == currentOrder?.property && (
                  <i className="text-lg pr-1">
                    {currentOrder?.type == "asc" ? <RiArrowUpLine /> : <RiArrowDownLine />}
                  </i>
                )}
                {col.label}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {!tableItems && (
          <tr>
            <td className="border-b" colSpan={100}>
              <Spinner className="py-20" />
            </td>
          </tr>
        )}
        {tableItems && !tableItems.length && (
          <tr>
            <td className="border-b" colSpan={100}>
              <NotFound className="py-20" text={`Không tìm thấy ${itemName}`} />
            </td>
          </tr>
        )}
        {tableItems?.map((item, index) => (
          <tr
            onClick={(e) => {
              e.stopPropagation();
              onDoubleClick(e, item);
              onItemClick(item);
            }}
            key={index}
            className={`border-b text-gray-800 transition-colors duration-75 h-12 ${
              selection && selectedItems.find((x) => x.id == item.id)
                ? "bg-primary-light"
                : "hover:bg-gray-50"
            } ${index == tableItems.length - 1 ? "" : "border-gray-100"}`}
          >
            {columns.map((col, index, arr) => (
              <td
                key={index}
                className={`${
                  index == 0 ? "py-2 pl-3 pr-2" : index == arr.length - 1 ? "py-2 pl-2 pr-3" : "p-2"
                } ${col.center ? "text-center" : col.right ? "text-right" : "text-left"}`}
                style={{ width: col.width ? col.width + "px" : "auto" }}
              >
                {col.render(item)}
              </td>
            ))}
          </tr>
        ))}
        {children}
      </tbody>
    </table>
  );
}

interface ColumnProps extends ReactProps {
  label?: string;
  center?: boolean;
  right?: boolean;
  width?: number;
  orderBy?: string;
  render?: (item: BaseModel, column?: ColumnProps) => React.ReactNode;
}
const Column = ({ children }: ColumnProps) => children;
Column.displayName = "Column";
Table.Column = Column;

interface CellProps extends ReactProps {
  value: any;
}

interface CellTextProps extends CellProps {
  subText?: string;
  subTextClassName?: string;
  image?: string;
  imageClassName?: string;
  avatar?: string;
  ratio169?: boolean;
  percent?: number;
  compress?: number;
}
const CellText = ({
  value,
  className = "",
  style = {},
  subText = "",
  subTextClassName = "text-sm",
  image,
  avatar,
  imageClassName = "",
  ratio169,
  percent,
  compress,
}: CellTextProps) => (
  <div className="flex items-center">
    {(image !== undefined || avatar !== undefined) && (
      <Img
        compress={compress || 80}
        className={`w-10 mr-3 ${imageClassName}`}
        imageClassName={`border border-gray-300`}
        src={image || avatar}
        avatar={avatar !== undefined}
        showImageOnClick
        ratio169={ratio169}
        percent={percent}
      />
    )}
    <div className="flex-1">
      <div className={`${className}`} style={{ ...style }}>
        {value}
      </div>
      {subText && <div className={`${subTextClassName}`}>{subText}</div>}
    </div>
  </div>
);
CellText.displayName = "CellText";
Table.CellText = CellText;

interface CellDateProps extends CellProps {
  format?: string;
}
const CellDate = ({ value, className = "", style = {}, format = "dd-MM-yyyy" }: CellDateProps) => (
  <div className={`${className}`} style={{ ...style }}>
    {formatDate(new Date(value), format)}
  </div>
);
CellDate.displayName = "CellDate";
Table.CellDate = CellDate;

interface CellNumberProps extends CellProps {
  currency?: string | boolean;
}
const CellNumber = ({ value, className = "", style = {}, currency }: CellNumberProps) => (
  <div className={`${className}`} style={{ ...style }}>
    {NumberPipe(value, currency)}
  </div>
);
CellNumber.displayName = "CellNumber";
Table.CellNumber = CellNumber;

interface CellImageProps extends CellProps, ImgProps {
  center?: boolean;
  right?: boolean;
  compress?: number;
}
const CellImage = ({
  value,
  className = "",
  style = {},
  center,
  right,
  compress,
  ...props
}: CellImageProps) => (
  <Img
    compress={compress || 80}
    className={`flex ${center ? "mx-auto" : right ? "ml-auto" : "mr-auto"} ${className}`}
    imageClassName="border border-gray-300"
    style={{ ...style }}
    src={value}
    showImageOnClick
    {...props}
  />
);
CellImage.displayName = "CellImage";
Table.CellImage = CellImage;

interface CellStatusProps extends CellProps {
  options: Option[];
  isLabel?: boolean;
}
const CellStatus = ({
  value,
  className = "",
  style = {},
  options,
  isLabel = true,
}: CellStatusProps) => {
  let option = options.find((option) => option.value == value);
  return (
    <span
      className={`${isLabel ? "status-label" : "status-text"} ${
        option?.color
          ? isLabel
            ? "bg-" + option.color
            : "text-" + option.color
          : isLabel
          ? "bg-gray-400 text-gray-700"
          : "text-gray-700"
      } ${className}`}
      style={{
        ...style,
      }}
    >
      {option?.label}
    </span>
  );
};
CellStatus.displayName = "CellStatus";
Table.CellStatus = CellStatus;

interface CellActionProps extends ReactProps {}
const CellAction = ({ className = "", style = {}, children }: CellActionProps) => {
  return (
    <div className={`flex border-group ${className}`} style={{ ...style }}>
      {children}
    </div>
  );
};
CellAction.displayName = "CellAction";
Table.CellAction = CellAction;

interface CellButtonProps extends ButtonProps {
  value: BaseModel;
  isEditButton?: boolean;
  isDeleteButton?: boolean;
  refreshAfterTask?: boolean;
  moreItems?: ((ButtonProps & { refreshAfterTask?: boolean }) | "divider")[];
}
const CellButton = ({
  value,
  isEditButton,
  isDeleteButton,
  refreshAfterTask,
  moreItems,
  className = "",
  ...props
}: CellButtonProps) => {
  const { updateItemHref, onDeleteItem, onUpdateItem, loadAll } = useDataTable();
  const ref = useRef();

  let icon = props.icon;
  if (!icon) {
    if (isEditButton) {
      icon = <RiEdit2Line />;
    } else if (isDeleteButton) {
      icon = <RiDeleteBinLine />;
    } else if (moreItems) {
      icon = <RiMore2Line />;
    }
  }

  return (
    <>
      <Button
        {...props}
        icon={icon}
        innerRef={props.innerRef || ref}
        className={`text-xl px-3 ${className}`}
        href={
          props.href
            ? props.href
            : isEditButton && updateItemHref
            ? updateItemHref(value)
            : undefined
        }
        onClick={async (e) => {
          try {
            if (props.onClick) await props.onClick(e);
            if (isEditButton) await onUpdateItem(value);
            if (isDeleteButton) await onDeleteItem(value);
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
CellButton.displayName = "CellButton";
Table.CellButton = CellButton;
