import cloneDeep from "lodash/cloneDeep";
import { MouseEvent, useEffect, useState } from "react";
import { RiFile3Fill, RiFolder2Line, RiFolderOpenLine, RiFolderReduceLine } from "react-icons/ri";
import { Category, CategoryService } from "../../../../lib/repo/category.repo";
import { Product, ProductService } from "../../../../lib/repo/product.repo";
import { Button } from "../../../shared/utilities/form/button";
import { NotFound } from "../../../shared/utilities/not-found";
import { Spinner } from "../../../shared/utilities/spinner";
import { useProductsContext } from "../providers/products-provider";

interface PropsType extends ReactProps {
  category: Category;
  isLast?: boolean;
}

export function CategoryBranch({ category, ...props }: PropsType) {
  const [categories, setCategories] = useState<Category[]>(null);
  const [products, setProducts] = useState<Product[]>(null);
  const [loadDone, setLoadDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(!category);

  const {
    selectedItem,
    selectItem,
    createdItem,
    updatedItem,
    deletedItemId,
    refreshFlag,
    movedItem,
    updateCategorySubcategoriesOrder,
    expandedItem,
  } = useProductsContext();

  useEffect(() => {
    if (isOpen && !loadDone) {
      loadItems();
    }
    if (category) {
      category.isOpen = isOpen;
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedItem && category) {
      if (!selectedItem.categoryId && selectedItem.id == category.id) {
        setTimeout(() => {
          let el = document.getElementById(`category-${selectedItem.id}`);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 300);
      } else if (isOpen && loadDone && selectedItem.categoryId == category.id) {
        setTimeout(() => {
          let el = document.getElementById(`product-${selectedItem.id}`);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 300);
      }
    }
  }, [isOpen, loadDone, selectedItem]);

  useEffect(() => {
    if (refreshFlag && isOpen) {
      loadItems();
    }
  }, [refreshFlag]);

  useEffect(() => {
    if (selectedItem && category) {
      if (
        selectedItem.parentIds?.includes(category.id) ||
        selectedItem.categoryIds?.includes(category.id)
      ) {
        setIsOpen(true);
      }
    }
  }, [selectedItem]);

  useEffect(() => {
    if (createdItem) {
      if (createdItem.categoryId && createdItem.categoryId == category?.id) {
        loadItems("product").then((res) => {
          setIsOpen(true);
        });
      }
      if (createdItem.parentIds) {
        if (createdItem.parentIds.length == 0 && !category) {
          loadItems("category");
        } else if (createdItem.parentIds[0] == category?.id) {
          category.subCategoryIds = [...category.subCategoryIds, createdItem.id];
          loadItems("category").then((res) => {
            setIsOpen(true);
          });
        }
      }
    }
  }, [createdItem]);

  useEffect(() => {
    if (loadDone && updatedItem) {
      if (!updatedItem.categoryId) {
        if (
          (!updatedItem.parentIds.length && !category) ||
          updatedItem.parentIds[0] == category?.id
        ) {
          let index = categories.findIndex((x) => x.id == updatedItem.id);
          if (index >= 0) {
            categories[index].name = updatedItem.name;
            setCategories(cloneDeep(categories));
          }
        }
      } else if (products && updatedItem.categoryId == category?.id) {
        let index = products.findIndex((x) => x.id == updatedItem.id);
        if (index >= 0) {
          products[index].name = updatedItem.name;
          setProducts(cloneDeep(products));
        }
      }
    }
  }, [updatedItem]);

  useEffect(() => {
    if (loadDone) {
      let index = categories.findIndex((x) => x.id == deletedItemId);
      if (index >= 0) {
        loadItems("category");
      } else {
        index = products.findIndex((x) => x.id == deletedItemId);
        if (index >= 0) {
          loadItems("product");
        }
      }
    }
  }, [deletedItemId]);

  useEffect(() => {
    if (category && movedItem?.item?.parentIds.indexOf(category.id) == 0) {
      let index = category.subCategoryIds.findIndex((x) => x == movedItem.item.id);
      if (index != -1) {
        let subCategoryIds = [...category.subCategoryIds];
        if (movedItem.direction == "up") {
          if (index == 0) return;

          const temp = subCategoryIds[index];
          subCategoryIds[index] = subCategoryIds[index - 1];
          subCategoryIds[index - 1] = temp;
        }
        if (movedItem.direction == "down") {
          if (index >= subCategoryIds.length - 1) return;

          const temp = subCategoryIds[index];
          subCategoryIds[index] = subCategoryIds[index + 1];
          subCategoryIds[index + 1] = temp;
        }
        category.subCategoryIds = subCategoryIds;
        updateCategorySubcategoriesOrder(category.id, subCategoryIds).then((res) => {
          setCategories(res.map((x) => categories.find((y) => y.id == x)).filter(Boolean));
        });
      }
    }
  }, [movedItem]);

  useEffect(() => {
    if (expandedItem && !isOpen) {
      if (expandedItem.id) {
        if (expandedItem.id == category.id || category.parentIds.includes(expandedItem.id)) {
          setIsOpen(true);
        }
      } else {
        setIsOpen(true);
      }
    }
  }, [expandedItem]);

  const loadItems = async (mode?: "category" | "product") => {
    setLoading(true);
    let tasks = [];

    if (!mode || mode == "category") {
      tasks.push(
        CategoryService.getAll({
          query: {
            limit: 0,
            filter: category
              ? {
                  _id: { $in: category.subCategoryIds },
                }
              : {
                  parentIds: { $size: 0 },
                },
          },
        }).then((res) => {
          let cats = cloneDeep(res.data);
          if (category) {
            setCategories(
              category.subCategoryIds.map((x) => cats.find((y) => y.id == x)).filter(Boolean)
            );
          } else {
            setCategories(cats);
          }
        })
      );
    }

    if (category) {
      if (!mode || mode == "product") {
        tasks.push(
          ProductService.getAll({
            query: {
              limit: 0,
              filter: { categoryId: category.id },
            },
          }).then((res) => {
            setProducts(cloneDeep(res.data));
          })
        );
      }
    } else {
      setProducts([]);
    }
    Promise.allSettled(tasks).then(() => {
      setLoadDone(true);
      setLoading(false);
    });
  };

  const onCategoryClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (e.detail == 1) {
      selectItem(category);
    } else if (e.detail == 2) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <>
      {!category && !loadDone ? (
        <Spinner />
      ) : (
        <>
          <div
            className={`relative ${category?.parentIds?.length ? "branch-item" : ""} ${
              props.isLast ? "is-last" : ""
            }`}
          >
            {category && (
              <div className="flex mb-1" id={`category-${category.id}`}>
                <Button
                  hoverAccent
                  icon={isOpen ? <RiFolderOpenLine /> : <RiFolder2Line />}
                  className="w-7 h-7 px-0"
                  iconClassName={`text-lg`}
                  isLoading={loading}
                  onClick={() => setIsOpen(!isOpen)}
                />
                <button
                  type="button"
                  className={`px-1 no-focus flex items-center rounded font-semibold cursor-pointer whitespace-nowrap text-sm ${
                    selectedItem?.id == category?.id
                      ? "text-white bg-primary"
                      : "text-gray-700 hover:text-primary hover:bg-primary-light"
                  } max-w-xs text-ellipsis`}
                  style={{ display: "inline-block" }}
                  onClick={(e) => onCategoryClick(e)}
                >
                  {category.name}
                </button>
              </div>
            )}
            {loadDone && isOpen && (
              <div
                className={`relative flex flex-col items-start ${
                  category ? "pl-4" : ""
                } branch-group`}
              >
                {!categories?.length && !products?.length && (
                  <>
                    {category ? (
                      <div
                        className={`relative flex mb-1 branch-item is-last pl-2 text-sm text-gray-400`}
                      >
                        Danh mục rỗng
                      </div>
                    ) : (
                      <NotFound icon={<RiFolderReduceLine />} text="Chưa có danh mục nào" />
                    )}
                  </>
                )}
                {categories?.map((category, index) => (
                  <CategoryBranch
                    key={category.id}
                    category={category}
                    isLast={index == categories.length - 1 && !products?.length}
                  />
                ))}
                {products?.map((product, index) => (
                  <div
                    className={`relative flex mb-1 branch-item ${
                      products.length - 1 == index ? "is-last" : ""
                    }`}
                    id={`product-${product.id}`}
                    key={product.id}
                  >
                    <Button
                      icon={<RiFile3Fill />}
                      className="w-7 h-7 px-0"
                      iconClassName={`text-lg`}
                      onClick={() => selectItem(product)}
                    />
                    <button
                      type="button"
                      className={`px-1 no-focus flex items-center rounded font-semibold cursor-pointer whitespace-nowrap text-sm ${
                        selectedItem?.id == product?.id
                          ? "text-white bg-primary"
                          : "text-gray-700 hover:text-primary hover:bg-primary-light"
                      } max-w-xs text-ellipsis`}
                      style={{ display: "inline-block" }}
                      onClick={() => selectItem(product)}
                    >
                      {product.name}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
      <style jsx>{`
        .branch-group {
        }
        .branch-item:not(.is-last)::before {
          position: absolute;
          content: "";
          top: -12px;
          left: -4px;
          width: 1px;
          height: calc(100% + 24px);
          border-left: 1px solid #ccc;
        }
        .branch-item.is-last::before {
          position: absolute;
          content: "";
          top: -8px;
          left: -4px;
          width: 1px;
          height: 20px;
          border-left: 1px solid #ccc;
        }
        .branch-item::after {
          position: absolute;
          content: "";
          top: 12px;
          left: -4px;
          width: 8px;
          height: 1px;
          border-top: 1px solid #ccc;
        }
      `}</style>
    </>
  );
}
