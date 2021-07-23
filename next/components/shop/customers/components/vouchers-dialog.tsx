import format from "date-fns/format";
import { useState } from "react";
import {
  CustomerVoucher,
  CustomerVoucherService,
} from "../../../../lib/repo/customer-voucher.repo";
import { ShopVoucher, SHOP_VOUCHER_TYPES } from "../../../../lib/repo/shop-voucher.repo";
import { Dialog, DialogPropsType } from "../../../shared/utilities/dialog/dialog";
import { Field } from "../../../shared/utilities/form/field";
import { Select } from "../../../shared/utilities/form/select";
import { DataTable } from "../../../shared/utilities/table/data-table";

interface PropsType extends DialogPropsType {
  filter: any;
}
export function VouchersDialog({ filter, ...props }: PropsType) {
  return (
    <Dialog width="1280px" {...props}>
      <Dialog.Body>
        {filter && (
          <>
            <DataTable<CustomerVoucher>
              crudService={CustomerVoucherService}
              order={{ createdAt: -1 }}
              fragment={CustomerVoucherService.fullFragment}
              filter={filter}
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
                </DataTable.Buttons>
              </DataTable.Header>

              <DataTable.Divider />

              <DataTable.Toolbar>
                <DataTable.Search className="h-12" />
                <DataTable.Filter>
                  <Field name="type" noError>
                    <Select
                      className="h-12"
                      autosize
                      clearable
                      placeholder="Tất cả loại"
                      options={SHOP_VOUCHER_TYPES}
                    />
                  </Field>
                </DataTable.Filter>
              </DataTable.Toolbar>

              <DataTable.Table className="mt-4 bg-white">
                <DataTable.Column
                  label="Mã khuyến mãi"
                  className="max-w-xs"
                  render={(item: CustomerVoucher) => (
                    <DataTable.CellText
                      image={item.voucher.image}
                      className="font-semibold"
                      value={item.voucherCode}
                      subText={item.voucher.description}
                    />
                  )}
                />
                <DataTable.Column
                  center
                  label="Loại"
                  render={(item: CustomerVoucher) => (
                    <DataTable.CellStatus value={item.voucher.type} options={SHOP_VOUCHER_TYPES} />
                  )}
                />
                {/* <DataTable.Column
            right
            render={(item: CustomerVoucher) => (
              <>
                <DataTable.CellButton hoverDanger value={item} isDeleteButton />
              </>
            )}
          /> */}
              </DataTable.Table>
              <DataTable.Pagination />
            </DataTable>
          </>
        )}
      </Dialog.Body>
    </Dialog>
  );
}
