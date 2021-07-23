import { useState } from "react";
import { RiBillLine, RiHome3Line, RiPhoneLine, RiTicketLine, RiUserLine } from "react-icons/ri";
import { NumberPipe } from "../../../lib/pipes/number";
import { Customer, CustomerService } from "../../../lib/repo/customer.repo";
import { Staff } from "../../../lib/repo/staff.repo";
import { OrdersDialog } from "../../shared/shop-layout/orders-dialog";
import { ShopPageTitle } from "../../shared/shop-layout/shop-page-title";
import { DataTable } from "../../shared/utilities/table/data-table";
import { VouchersDialog } from "./components/vouchers-dialog";

export function CustomersPage(props: ReactProps) {
  const [openCustomerOrder, setOpenCustomerOrder] = useState<string>("");
  const [openCustomerVouchers, setOpenCustomerVouchers] = useState<string>("");

  return (
    <>
      <DataTable<Customer> crudService={CustomerService} order={{ createdAt: -1 }}>
        <DataTable.Header>
          <ShopPageTitle title="Khách hàng" subtitle="Khách hàng hệ thống" />
          <DataTable.Buttons>
            <DataTable.Button
              outline
              isRefreshButton
              refreshAfterTask
              className="bg-white w-12 h-12"
            />
            {/* <DataTable.Button primary isAddButton className="bg-gradient h-12" /> */}
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
          <DataTable.Column
            right
            render={(item: Staff) => (
              <>
                <DataTable.CellButton
                  value={item}
                  icon={<RiTicketLine />}
                  tooltip="Lịch sử khuyến mãi"
                  onClick={() => {
                    setOpenCustomerVouchers(item.id);
                  }}
                />
                <DataTable.CellButton
                  value={item}
                  icon={<RiBillLine />}
                  tooltip="Lịch sử đơn hàng"
                  onClick={() => {
                    setOpenCustomerOrder(item.id);
                  }}
                />
                <DataTable.CellButton hoverDanger value={item} isDeleteButton />
              </>
            )}
          />
        </DataTable.Table>
        {/* <DataTable.Form
          extraDialogClass="bg-transparent"
          extraHeaderClass="bg-gray-100 text-xl py-3 justify-center rounded-t-xl border-gray-300 pl-16"
          extraBodyClass="px-6 bg-gray-100 rounded-b-xl"
          saveButtonGroupProps={{
            className: "justify-center",
            submitProps: { className: "bg-gradient h-14 w-64" },
            cancelText: "",
          }}
          grid
        >
        </DataTable.Form> */}
        <DataTable.Pagination />
      </DataTable>
      <OrdersDialog
        isOpen={!!openCustomerOrder}
        onClose={() => setOpenCustomerOrder("")}
        filter={openCustomerOrder ? { buyerId: openCustomerOrder } : null}
      />
      <VouchersDialog
        isOpen={!!openCustomerVouchers}
        onClose={() => setOpenCustomerVouchers("")}
        filter={openCustomerVouchers ? { customerId: openCustomerVouchers } : null}
      />
    </>
  );
}
