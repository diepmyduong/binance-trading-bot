import { FaAsterisk, FaMinus } from "react-icons/fa";
import { ProductTopping, ProductToppingService } from "../../../lib/repo/product-topping.repo";
import { ShopPageTitle } from "../../shared/shop-layout/shop-page-title";
import { DataTable } from "../../shared/utilities/table/data-table";
import { ProductToppingTableForm } from "./components/product-topping-table-form";

export function ProductToppingsPage(props: ReactProps) {
  return (
    <>
      <DataTable<ProductTopping> crudService={ProductToppingService} order={{ createdAt: -1 }}>
        <DataTable.Header>
          <ShopPageTitle title="Mẫu Topping" subtitle="Quản lý các mẫu topping để gắn vào món ăn" />
          <DataTable.Buttons>
            <DataTable.Button
              outline
              isRefreshButton
              refreshAfterTask
              className="bg-white w-12 h-12"
            />
            <DataTable.Button primary isAddButton className="bg-gradient h-12" />
          </DataTable.Buttons>
        </DataTable.Header>

        <DataTable.Divider />

        <DataTable.Toolbar>
          <DataTable.Search className="h-12" />
          <DataTable.Filter></DataTable.Filter>
        </DataTable.Toolbar>

        <DataTable.Table className="mt-4 bg-white">
          <DataTable.Column
            label="Tên topping"
            render={(item: ProductTopping) => <DataTable.CellText value={item.name} />}
          />
          <DataTable.Column
            label="Bắt buộc"
            center
            render={(item: ProductTopping) => (
              <DataTable.CellText
                className="flex justify-center"
                value={
                  item.required ? (
                    <i className="text-danger text-sm">
                      <FaAsterisk />
                    </i>
                  ) : (
                    <i className="text-gray-400">
                      <FaMinus />
                    </i>
                  )
                }
              />
            )}
          />
          <DataTable.Column
            label="Chọn tối thiểu"
            center
            render={(item: ProductTopping) => <DataTable.CellNumber value={item.min} />}
          />
          <DataTable.Column
            label="Chọn tối đa"
            center
            render={(item: ProductTopping) => <DataTable.CellNumber value={item.max} />}
          />
          <DataTable.Column
            right
            render={(item: ProductTopping) => (
              <>
                <DataTable.CellButton value={item} isEditButton />
                <DataTable.CellButton hoverDanger value={item} isDeleteButton />
              </>
            )}
          />
        </DataTable.Table>
        <ProductToppingTableForm />
        <DataTable.Pagination />
      </DataTable>
    </>
  );
}
