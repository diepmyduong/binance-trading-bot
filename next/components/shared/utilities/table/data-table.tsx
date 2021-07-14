import { createContext, useContext, useEffect, useState } from "react";
import { BaseModel, CrudRepository, Pagination, QueryInput } from "../../../../lib/repo/crud.repo";
import isEqual from "lodash/isEqual";
import { useToast } from "../../../../lib/providers/toast-provider";
import cloneDeep from "lodash/cloneDeep";
import { useAlert } from "../../../../lib/providers/alert-provider";
import { TableHeader } from "./table-header";
import { TableToolbar } from "./table-toolbar";
import { Table } from "./table";
import { TablePagination } from "./table-pagination";
import { TableForm } from "./table-form";
import useInterval from "../../../../lib/hooks/useInterval";

interface DataTableProps<T extends BaseModel> extends ReactProps {
  title?: string;
  itemName?: string;
  fragment?: string;
  apiName?: string;
  limit?: number;
  filter?: any;
  order?: any;
  selection?: "single" | "multi";
  createItem?: () => any;
  createItemHref?: () => string;
  updateItem?: (item: Partial<T>) => any;
  updateItemHref?: (item: Partial<T>) => string;
  postProcessItem?: (item: Partial<T>) => Partial<T>;
  crudService: CrudRepository<Partial<T>>;
  autoRefresh?: number;
}
export function DataTable<T extends BaseModel>({
  crudService,
  limit = 10,
  order = { createdAt: -1 },
  ...props
}: DataTableProps<T>) {
  const [title, setTitle] = useState(props.title);
  const [refreshing, setRefreshing] = useState(false);
  const [itemName, setItemName] = useState(props.itemName ? props.itemName.toLowerCase() : "");
  const [loadDone, setLoadDone] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);
  let [filter, setFilter] = useState({});
  const [search, setSearch] = useState("");
  const [currentOrder, setCurrentOrder] = useState<{ property: string; type: "asc" | "desc" }>(
    null
  );
  const [items, setItems] = useState<Partial<T>[]>(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    total: 0,
    limit: limit,
  });
  const [formItem, setFormItem] = useState(null);
  let [queryNumber] = useState(0);
  let [isLoading] = useState(false);
  let [timeout] = useState(null);
  let [isRefreshing] = useState(false);
  const toast = useToast();
  const alert = useAlert();

  useEffect(() => {
    if (!title) setTitle(`Danh sách ${crudService.displayName}`);
    if (!itemName) setItemName(`${crudService.displayName.toLowerCase()}`);
    setLoadDone(true);
  }, []);

  useInterval(async () => {
    if (!isLoading && !isRefreshing) {
      await loadAll(true, false);
    }
  }, props.autoRefresh);

  useEffect(() => {
    if (loadDone) {
      loadAll();
    }
  }, [loadDone, search, filter, props.filter, currentOrder, pagination.page, pagination.limit]);

  const waitUntil = (condition) => {
    return new Promise((resolve) => {
      let interval = setInterval(() => {
        if (!condition()) {
          return;
        }

        clearInterval(interval);
        resolve(true);
      }, 100);
    });
  };

  const loadAll = async (refresh = false, showLoading: boolean = true) => {
    if (isRefreshing) {
      await waitUntil(() => isRefreshing == false);
    }
    if (showLoading) {
      setLoadingItems(true);
    }
    isLoading = true;
    if (refresh) {
      isRefreshing = true;
      await crudService.clearStore();
      setTimeout(() => {
        isRefreshing = false;
      });
    }
    const currentQueryNumber = queryNumber + 1;
    queryNumber = currentQueryNumber;
    let query: QueryInput = {
      limit: pagination.limit,
      page: pagination.page,
      filter: { ...filter, ...props.filter },
      order: {
        ...(currentOrder ? { [currentOrder.property]: currentOrder.type == "asc" ? 1 : -1 } : {}),
        ...order,
      },
      search,
    };
    await crudService
      .getAll({ query, fragment: props.fragment, apiName: props.apiName })
      .then((res) => {
        if (currentQueryNumber != queryNumber) return;
        setItems(res.data.map((x) => (props.postProcessItem ? props.postProcessItem(x) : x)));
        if (showLoading) {
          setLoadingItems(false);
        }
        setPagination({ ...pagination, ...res.pagination });
      })
      .catch((err) => {
        console.error(err);
        toast.error("Lỗi khi tải danh sách " + itemName);
      })
      .finally(() => {
        isLoading = false;
      });
  };

  const onFilterChange = (registeredFilter: any) => {
    let newFilter = { ...filter, ...registeredFilter };
    newFilter = Object.keys(newFilter)
      .filter(
        (key) => newFilter[key] !== "" && newFilter[key] !== undefined && newFilter[key] !== null
      )
      .reduce((obj, key) => {
        obj[key] = newFilter[key];
        return obj;
      }, {});
    if (!isEqual(filter, newFilter)) {
      filter = newFilter;
      setFilter(newFilter);
    }
  };

  const onSearchChange = (search: string) => {
    setSearch(search);
  };

  const onCreateItem = () => {
    if (props.createItem || props.createItemHref) {
      if (props.createItem) props.createItem();
    } else {
      setFormItem({});
    }
  };

  const onUpdateItem = (item: Partial<T>) => {
    if (props.updateItem || props.updateItemHref) {
      if (props.updateItem) props.updateItem(item);
    } else {
      setFormItem(item);
    }
  };

  const onDeleteItem = async (item: Partial<T>) => {
    let name: string = item.name || item.title || item.code;
    if (name && name.length > 25) {
      name = name.slice(0, 22) + "...";
    }
    if (
      !(await alert.danger(
        `Xoá ${itemName}`,
        `Bạn có chắn chắn muốn xoá ${itemName} ${name ? `'${name}'` : "này"} không?`
      ))
    )
      return;

    try {
      await crudService.delete({ id: item.id, toast });
      await loadAll();
    } catch (err) {}
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await loadAll(true);
    } finally {
      setRefreshing(false);
    }
  };

  const saveItem = async (data: Partial<T>) => {
    try {
      let item = await crudService.createOrUpdate({ id: formItem.id, data, toast });
      await loadAll();
      setFormItem(null);
      return item;
    } catch (err) {}
  };

  return (
    <DataTableContext.Provider
      value={{
        title,
        itemName,
        pagination,
        setPagination,
        items,
        loadingItems,
        search,
        onSearchChange,
        onFilterChange,
        refreshing,
        onRefresh,
        selection: props.selection,
        selectedItems,
        setSelectedItems,
        formItem,
        setFormItem,
        currentOrder,
        setCurrentOrder,
        createItemHref: props.createItemHref,
        updateItemHref: props.updateItemHref,
        onCreateItem,
        onUpdateItem,
        onDeleteItem,
        saveItem,
        loadAll,
      }}
    >
      {props.children}
    </DataTableContext.Provider>
  );
}

interface DataTableContextProps<T extends BaseModel> extends ReactProps {
  title: string;
  itemName: string;
  pagination: Pagination;
  setPagination: (val: Pagination) => any;
  items: T[];
  loadingItems: boolean;
  search: string;
  onSearchChange: (search: string) => any;
  onFilterChange: (filter: any) => any;
  refreshing: boolean;
  onRefresh: () => any;
  selection: "single" | "multi";
  selectedItems: T[];
  setSelectedItems: (items: T[]) => any;
  formItem: any;
  setFormItem: (val: boolean) => any;
  currentOrder: { property: string; type: "asc" | "desc" };
  setCurrentOrder: (val: { property: string; type: "asc" | "desc" }) => any;
  createItemHref: () => string;
  updateItemHref: (item: T) => string;
  onCreateItem: () => any;
  onUpdateItem: (item: Partial<T>) => any;
  onDeleteItem: (item: Partial<T>) => Promise<any>;
  saveItem: (data: Partial<T>) => Promise<Partial<T>>;
  loadAll: (refresh?: boolean) => Promise<any>;
}
const DataTableContext = createContext<Partial<DataTableContextProps<BaseModel>>>({});
export const useDataTable = () => useContext(DataTableContext);

export const TableDivider = () => <hr className="my-3 border-0 border-t border-gray-200" />;

DataTable.Divider = TableDivider;

DataTable.Header = TableHeader;
DataTable.Title = TableHeader.Title;
DataTable.Buttons = TableHeader.Buttons;
DataTable.Button = TableHeader.Button;

DataTable.Toolbar = TableToolbar;
DataTable.Search = TableToolbar.Search;
DataTable.Filter = TableToolbar.Filter;

DataTable.Table = Table;
DataTable.Column = Table.Column;
DataTable.CellAction = Table.CellAction;
DataTable.CellButton = Table.CellButton;
DataTable.CellDate = Table.CellDate;
DataTable.CellImage = Table.CellImage;
DataTable.CellNumber = Table.CellNumber;
DataTable.CellStatus = Table.CellStatus;
DataTable.CellText = Table.CellText;

DataTable.Pagination = TablePagination;
DataTable.Form = TableForm;

DataTable.Consumer = DataTableContext.Consumer;
