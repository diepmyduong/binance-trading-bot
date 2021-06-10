import { Children } from "react";
import { RiSearchLine } from "react-icons/ri";
import { Form, FormPropsType } from "../form/form";
import { Input, InputProps } from "../form/input";
import { useDataTable } from "./data-table";

interface PropsType extends ReactProps {}

export function TableToolbar({ ...props }: PropsType) {
  const { itemName, onFilterChange, onSearchChange } = useDataTable();

  const searchComponents = Children.map(props.children, (child) =>
    child?.type?.displayName === "Search" ? { child } : null
  );
  const filterComponents = Children.map(props.children, (child) =>
    child?.type?.displayName === "Filter" ? { child } : null
  );
  let children = Children.map(props.children, (child) =>
    !child?.type?.displayName ? child : null
  );
  return (
    <div className="flex justify-between items-center gap-x-2">
      <div>
        {!!searchComponents?.length &&
          searchComponents.map((search, index) => (
            <Input
              key={index}
              className="min-w-sm"
              clearable
              prefix={
                <i className="text-xl">
                  <RiSearchLine />
                </i>
              }
              placeholder={`Tìm kiếm ${itemName}`}
              debounce={300}
              onChange={onSearchChange}
              {...search.child.props}
            />
          ))}
      </div>
      <div className="flex-1 flex justify-end">
        {!!filterComponents?.length &&
          filterComponents.map((search, index) => (
            <Form
              key={index}
              className="w-auto flex gap-x-2"
              {...search.child?.props}
              onChange={onFilterChange}
            >
              {search.child?.props?.children}
            </Form>
          ))}
      </div>
    </div>
  );
}

const Search = ({ children }: InputProps) => children;
Search.displayName = "Search";
TableToolbar.Search = Search;

const Filter = ({ children }: FormPropsType) => children;
Filter.displayName = "Filter";
TableToolbar.Filter = Filter;

// type ButtonCompProps = ButtonProps & { isAddButton?: boolean; isDeleteButton?: boolean };
// const ButtonComp = ({ isAddButton, isDeleteButton, children, ...props }: ButtonCompProps) =>
//   children;
// ButtonComp.displayName = "Button";
// TableHeader.Button = ButtonComp;
