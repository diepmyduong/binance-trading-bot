import isEqual from "lodash/isEqual";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { useAlert } from "../../../../lib/providers/alert-provider";
import { useToast } from "../../../../lib/providers/toast-provider";
import { Category, CategoryService } from "../../../../lib/repo/category.repo";
import { Product, ProductService } from "../../../../lib/repo/product.repo";
export const ProductsContext = createContext<
  Partial<{
    selectedItem: Category | Product;
    selectItem: (item: Category | Product) => any;
    createdItem: Category | Product;
    createProduct: () => Promise<any>;
    createCategory: () => Promise<any>;
    updatedItem: Category | Product;
    setUpdatedItem: (val: Category | Product) => any;
    deletedItemId: string;
    deleteSelectedItem: () => Promise<any>;
    duplicateProduct: () => Promise<any>;
    refreshFlag: number;
    refresh: () => any;
    movedItem: { item: Category; direction: "up" | "down" };
    updateCategorySubcategoriesOrder: (id: string, subCategoryIds: string[]) => Promise<string[]>;
    moveCategory: (direction: "up" | "down") => any;
    copyItem: () => any;
    copiedItem: Category | Product;
    pasteItem: () => any;
    expandCategory: () => any;
    expandedItem: { id: string };
    search: string;
    setSearch: (val: string) => any;
    searchedCategory: Category[];
    searchedProduct: Product[];
  }>
>({});

export function ProductsProvider(props) {
  const [selectedItem, setSelectedItem] = useState<Category | Product>(null);
  const [deletedItemId, setDeletedItemId] = useState("");
  const [createdItem, setCreatedItem] = useState(null);
  const [updatedItem, setUpdatedItem] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [movedItem, setMovedItem] = useState<{ item: Category; direction: "up" | "down" }>(null);
  const [copiedItem, setCopiedItem] = useState<Category | Product>(null);
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [expandedItem, setExpandedItem] = useState<{ id: string }>(null);
  const [search, setSearch] = useState("");
  const [searchedCategory, setSearchedCategory] = useState<Category[]>(null);
  const [searchedProduct, setSearchedProduct] = useState<Product[]>(null);
  const toast = useToast();
  const alert = useAlert();

  useEffect(() => {
    if (search) {
      CategoryService.getAll({ query: { limit: 0, search } }).then((res) => {
        setSearchedCategory(res.data);
      });
      ProductService.getAll({ query: { limit: 0, search } }).then((res) => {
        setSearchedProduct(res.data);
      });
    } else {
      setSearchedCategory(null);
      setSearchedProduct(null);
    }
  }, [search]);

  const selectItem = (item: Category | Product) => {
    setSelectedItem(item);
  };

  const createProduct = async () => {
    let item = selectedItem as Category;
    if (item && !item.categoryId) {
      let res = await ProductService.create({
        data: {
          name: "(Sản phẩm mới)",
          categoryId: item.id,
          basePrice: 0,
        },
      });
      setCreatedItem(res);
      selectItem(res);
    }
  };

  const createCategory = async () => {
    let item = selectedItem;
    if (!item || !item.categoryId) {
      let res = await CategoryService.create({
        data: {
          name: "(Danh mục mới)",
          parentId: item ? item.id : null,
        },
      });
      setCreatedItem(res);
      selectItem(res);
    } else {
      let res = await CategoryService.create({
        data: {
          name: "(Danh mục mới)",
          parentId: item ? item.categoryId : null,
        },
      });
      setCreatedItem(res);
      selectItem(res);
    }
  };

  const deleteSelectedItem = async () => {
    let item = selectedItem;
    if (item.categoryId) {
      if (
        !(await alert.danger(
          "Xoá sản phẩm",
          `Bạn có chắc chắn muốn xoá sản phẩm '${item.name}' không?`
        ))
      )
        return;

      setDeleting(true);
      try {
        await ProductService.delete({ id: item.id, toast });
        setDeletedItemId(item.id);
        setSelectedItem(null);
      } finally {
        setDeleting(false);
      }
    } else {
      if (
        !(await alert.danger(
          "Xoá danh mục",
          `Bạn có chắc chắn muốn xoá danh mục '${item.name}' không?`
        ))
      )
        return;

      setDeleting(true);
      try {
        await CategoryService.delete({ id: item.id, toast });
        setDeletedItemId(item.id);
        setSelectedItem(null);
      } finally {
        setDeleting(false);
      }
    }
  };

  const duplicateProduct = async () => {
    let item = selectedItem as Product;
    if (item.categoryId) {
      try {
        let {
          name,
          profitRate,
          categoryId,
          basePrice,
          shortDesc,
          description,
          images,
          youtubeLink,
          params,
        } = item;
        let res = await ProductService.create({
          data: {
            name: name + " Copy",
            profitRate,
            categoryId,
            basePrice,
            shortDesc,
            description,
            images,
            youtubeLink,
            params,
          },
          toast,
        });
        setCreatedItem(res);
        selectItem(res);
      } catch (err) {}
    }
  };

  const refresh = async () => {
    await ProductService.clearStore();
    setRefreshFlag(refreshFlag + 1);
  };

  const moveCategory = (direction: "up" | "down") => {
    if (selectedItem && selectedItem.parentIds.length) {
      setMovedItem({ item: selectedItem as Category, direction });
    }
  };

  const updateCategorySubcategoriesOrder = async (
    id: string,
    subCategoryIds: string[]
  ): Promise<string[]> => {
    return await CategoryService.update({
      id,
      data: { subCategoryIds },
    })
      .then((res) => {
        setMovedItem(null);
        return res.subCategoryIds;
      })
      .catch((err) => {
        console.error(err);
        toast.error("Di chuyển thư mục thất bại. " + err.message);
        return null;
      });
  };

  const copyItem = () => {
    if (selectedItem) {
      setCopiedItem(selectedItem);
      if (selectedItem.categoryId) {
        toast.success("Đã sao chép sản phẩm");
      } else {
        toast.success("Đã sao chép danh mục");
      }
    }
  };

  const pasteItem = async () => {
    if (copiedItem && selectedItem) {
      if (copiedItem.categoryId) {
        try {
          let res = await ProductService.copyProduct(
            copiedItem.id,
            selectedItem.categoryId || selectedItem.id
          );
          setCreatedItem(res);
          selectItem(res);
        } catch (err) {
          console.error(err);
          toast.error("Dán sản phẩm thất bại. " + err.message);
        }
      } else {
        try {
          let res = await CategoryService.copyCategory(
            copiedItem.id,
            selectedItem.categoryId || selectedItem.id
          );
          setCreatedItem(res);
          selectItem(res);
        } catch (err) {
          console.error(err);
          toast.error("Dán danh mục thất bại. " + err.message);
        }
      }
    }
  };

  const expandCategory = () => {
    if (!selectedItem || !selectedItem.categoryId) {
      setExpandedItem({ id: selectedItem ? selectedItem.id : null });
    }
  };

  return (
    <ProductsContext.Provider
      value={{
        selectedItem,
        selectItem,
        createdItem,
        createProduct,
        createCategory,
        updatedItem,
        setUpdatedItem,
        deletedItemId,
        deleteSelectedItem,
        duplicateProduct,
        refreshFlag,
        refresh,
        movedItem,
        updateCategorySubcategoriesOrder,
        moveCategory,
        copyItem,
        copiedItem,
        pasteItem,
        expandCategory,
        expandedItem,
        search,
        setSearch,
        searchedCategory,
        searchedProduct,
      }}
    >
      {props.children}
    </ProductsContext.Provider>
  );
}

export const useProductsContext = () => useContext(ProductsContext);
