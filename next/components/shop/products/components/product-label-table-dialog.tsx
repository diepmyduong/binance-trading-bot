import { ProductLabelService, PRODUCT_LABEL_COLORS } from "../../../../lib/repo/product-label.repo";
import { ProductLabel } from "../../../../lib/repo/product.repo";
import { Dialog, DialogPropsType } from "../../../shared/utilities/dialog/dialog";
import { Field } from "../../../shared/utilities/form/field";
import { Input } from "../../../shared/utilities/form/input";
import { Select } from "../../../shared/utilities/form/select";
import { DataTable } from "../../../shared/utilities/table/data-table";

interface PropsType extends DialogPropsType {}
export function ProductLabelTableDialog({ ...props }: PropsType) {
  return (
    <Dialog {...props}>
      <Dialog.Body>
        <DataTable<ProductLabel>
          crudService={ProductLabelService}
          order={{ createdAt: -1 }}
          limit={0}
        >
          <DataTable.Header>
            <DataTable.Title />
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

          {/* <DataTable.Toolbar>
            <DataTable.Search className="h-12" />
            <DataTable.Filter></DataTable.Filter>
          </DataTable.Toolbar> */}

          <DataTable.Table className="mt-4 bg-white">
            <DataTable.Column
              label="Tên nhãn"
              render={(item: ProductLabel) => <DataTable.CellText value={item.name} />}
            />
            <DataTable.Column
              label="Màu sắc"
              render={(item: ProductLabel) => (
                <DataTable.CellText
                  value={
                    <div className="flex items-center">
                      <div
                        className="w-8 h-8 rounded"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="pl-2 font-semibold">
                        {PRODUCT_LABEL_COLORS.find((x) => x.value == item.color)?.label}
                      </span>
                    </div>
                  }
                />
              )}
            />
            <DataTable.Column
              right
              render={(item: ProductLabel) => (
                <>
                  <DataTable.CellButton value={item} isEditButton />
                  <DataTable.CellButton hoverDanger value={item} isDeleteButton />
                </>
              )}
            />
          </DataTable.Table>
          <DataTable.Form width="400px">
            <Field label="Tên nhãn" name="name">
              <Input />
            </Field>
            <Field label="Màu nhãn" name="color">
              <Select hasColor options={PRODUCT_LABEL_COLORS} />
            </Field>
          </DataTable.Form>
          <DataTable.Pagination />
        </DataTable>
      </Dialog.Body>
    </Dialog>
  );
}
