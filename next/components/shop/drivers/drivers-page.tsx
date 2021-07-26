import { useState } from "react";
import { RiBillLine, RiPhoneLine } from "react-icons/ri";
import { NumberPipe } from "../../../lib/pipes/number";
import { Driver, DriverService, DRIVER_STATUS } from "../../../lib/repo/driver.repo";
import { OrdersDialog } from "../../shared/shop-layout/orders-dialog";
import { ShopPageTitle } from "../../shared/shop-layout/shop-page-title";
import { Field } from "../../shared/utilities/form/field";
import { ImageInput } from "../../shared/utilities/form/image-input";
import { Input } from "../../shared/utilities/form/input";
import { DataTable } from "../../shared/utilities/table/data-table";

export function DriversPage(props: ReactProps) {
  const [openOrders, setOpenOrders] = useState<string>("");

  return (
    <>
      <DataTable<Driver> crudService={DriverService} order={{ createdAt: -1 }}>
        <DataTable.Header>
          <ShopPageTitle title="Tài xế" subtitle="Quản lý tài xế nội bộ" />
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
            label="Tài xế"
            render={(item: Driver) => (
              <DataTable.CellText
                avatar={item.avatar}
                value={item.name}
                className="font-semibold"
                subTextClassName="flex"
                subText={
                  <>
                    <i className="mt-1 mr-1">
                      <RiPhoneLine />
                    </i>
                    {item.phone}
                  </>
                }
              />
            )}
          />
          {/* <DataTable.Column
            label="Số điện thoại"
            render={(item: Driver) => (
              <DataTable.CellText
                className="flex"
                value={
                  <>
                    <i className="text-lg mt-1 mr-1">
                      <RiPhoneLine />
                    </i>
                    {item.phone}
                  </>
                }
              />
            )}
          /> */}
          <DataTable.Column
            center
            label="Biển số xe"
            render={(item: Driver) => (
              <DataTable.CellText
                className="flex justify-center"
                value={
                  <div
                    className="bg-white border-2 border-gray-600 text-gray-700 p-1.5 rounded font-bold uppercase text-lg"
                    style={{
                      minWidth: "144px",
                      boxShadow: "inset 0 0 20px -10px hsla(0,0%,0%,.35)",
                    }}
                  >
                    {item.licensePlates}
                  </div>
                }
              />
            )}
          />
          <DataTable.Column
            center
            label="Trạng thái"
            render={(item: Driver) => (
              <DataTable.CellStatus value={item.status} options={DRIVER_STATUS} />
            )}
          />
          <DataTable.Column
            label="Đơn hàng"
            render={(item: Driver) => (
              <DataTable.CellText
                value={
                  <>
                    <div className="flex whitespace-nowrap">
                      <span className="w-28">Tổng ship:</span>
                      <span className="text-primary font-semibold">
                        {NumberPipe(item.orderStats?.shipfee, true)}
                      </span>
                    </div>
                    <div className="flex whitespace-nowrap">
                      <span className="w-28">Thành công:</span>
                      <span className="text-success font-semibold">
                        {NumberPipe(item.orderStats?.completed)} đơn
                      </span>
                    </div>
                    <div className="flex whitespace-nowrap">
                      <span className="w-28">Thất bại:</span>
                      <span className="text-danger font-semibold">
                        {NumberPipe(item.orderStats?.failure)} đơn
                      </span>
                    </div>
                    <div className="flex whitespace-nowrap">
                      <span className="w-28">Tổng đơn:</span>
                      <span className="font-bold">{NumberPipe(item.orderStats?.total)} đơn</span>
                    </div>
                  </>
                }
              />
            )}
          />
          <DataTable.Column
            right
            render={(item: Driver) => (
              <>
                <DataTable.CellButton
                  value={item}
                  icon={<RiBillLine />}
                  tooltip="Đơn hàng đã giao"
                  onClick={() => {
                    setOpenOrders(item.id);
                  }}
                />
                <DataTable.CellButton value={item} isEditButton />
                <DataTable.CellButton hoverDanger value={item} isDeleteButton />
              </>
            )}
          />
        </DataTable.Table>
        <DataTable.Form
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
          <Field name="name" label="Tên tài xế" cols={12} required>
            <Input />
          </Field>
          <Field name="phone" label="Số điện thoại" cols={6} required>
            <Input />
          </Field>
          <Field name="licensePlates" label="Biển số xe" cols={6} required>
            <Input />
          </Field>
          <Field name="avatar" label="Avatar" cols={12}>
            <ImageInput avatar />
          </Field>
        </DataTable.Form>
        <DataTable.Pagination />
      </DataTable>
      <OrdersDialog
        mode="driver"
        isOpen={!!openOrders}
        onClose={() => setOpenOrders("")}
        filter={openOrders ? { driverId: openOrders } : null}
      />
    </>
  );
}
