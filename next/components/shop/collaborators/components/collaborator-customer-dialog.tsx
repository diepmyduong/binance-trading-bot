import format from "date-fns/format";
import { useState } from "react";
import { RiHome3Line, RiPhoneLine, RiTicketLine, RiUserLine } from "react-icons/ri";
import { NumberPipe } from "../../../../lib/pipes/number";
import {
  CustomerVoucher,
  CustomerVoucherService,
} from "../../../../lib/repo/customer-voucher.repo";
import { Customer, CustomerService } from "../../../../lib/repo/customer.repo";
import { ShopVoucher, SHOP_VOUCHER_TYPES } from "../../../../lib/repo/shop-voucher.repo";
import { Dialog, DialogPropsType } from "../../../shared/utilities/dialog/dialog";
import { Field } from "../../../shared/utilities/form/field";
import { Select } from "../../../shared/utilities/form/select";
import { DataTable } from "../../../shared/utilities/table/data-table";

interface PropsType extends DialogPropsType {
  collaboratorId: string;
}
export function CollaboratorCustomerDialog({ collaboratorId, ...props }: PropsType) {
  return (
    <Dialog width="1280px" {...props}>
      <Dialog.Body>
        <DataTable<Customer>
          crudService={CustomerService}
          order={{ createdAt: -1 }}
          // fragment={CustomerVoucherService.fullFragment}
          filter={{ collaboratorId }}
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
            <DataTable.Filter></DataTable.Filter>
          </DataTable.Toolbar>

          <DataTable.Table className="mt-4 bg-white">
            <DataTable.Column
              label="Khách hàng"
              render={(item: Customer) => (
                <DataTable.CellText
                  value={
                    <div className="flex font-semibold">
                      <i className="text-lg mt-1 mr-1">
                        <RiPhoneLine />
                      </i>
                      {item.phone}
                    </div>
                  }
                  subTextClassName="flex text-sm mt-1"
                  subText={
                    <>
                      <i className="mt-0.5 mr-2">
                        <RiUserLine />
                      </i>
                      {item.name || "Khách vãng lai"}
                    </>
                  }
                />
              )}
            />
            <DataTable.Column
              label="Đơn hàng"
              render={(item: Customer) => (
                <DataTable.CellText
                  value={
                    <>
                      <div className="flex whitespace-nowrap">
                        <span className="w-28">Thành công:</span>
                        <span className="text-success font-semibold">
                          {NumberPipe(item.orderStats?.completed)} đơn
                        </span>
                      </div>
                      <div className="flex whitespace-nowrap">
                        <span className="w-28">Đã huỷ:</span>
                        <span className="text-danger font-semibold">
                          {NumberPipe(item.orderStats?.canceled)} đơn
                        </span>
                      </div>
                      <div className="flex whitespace-nowrap">
                        <span className="w-28">Tổng cộng:</span>
                        <span className="font-bold">{NumberPipe(item.orderStats?.total)} đơn</span>
                      </div>
                    </>
                  }
                />
              )}
            />
            <DataTable.Column
              label="Giảm giá"
              render={(item: Customer) => (
                <DataTable.CellText
                  value={
                    <>
                      <div className="flex">
                        <i className="text-lg mt-1 mr-1">
                          <RiTicketLine />
                        </i>
                        Số voucher dùng: {item.orderStats?.voucher}
                      </div>
                      <div className="flex">
                        <i className="text-lg mt-1 mr-1">
                          <RiHome3Line />
                        </i>
                        Tổng giảm giá: {NumberPipe(item.orderStats?.discount, true)}
                      </div>
                    </>
                  }
                />
              )}
            />
            <DataTable.Column
              right
              label="Tổng doanh số"
              render={(item: Customer) => (
                <DataTable.CellNumber
                  currency
                  className="text-primary font-bold text-lg"
                  value={item.orderStats?.revenue}
                />
              )}
            />
          </DataTable.Table>
          <DataTable.Pagination />
        </DataTable>
      </Dialog.Body>
    </Dialog>
  );
}
