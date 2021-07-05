import { useState } from "react";
import { RiEyeLine } from "react-icons/ri";
import { Order, OrderService, ORDER_STATUS } from "../../../lib/repo/order.repo";
import { ShopPageTitle } from "../../shared/shop-layout/shop-page-title";
import { DataTable } from "../../shared/utilities/table/data-table";
import { OrderDetailsDialog } from "./components/order-details-dialog";

export function OrdersPage(props: ReactProps) {
  const [orderId, setOrderId] = useState<string>("");

  return (
    <>
      <DataTable<Order> crudService={OrderService} order={{ createdAt: -1 }}>
        <DataTable.Header>
          <ShopPageTitle title="Đơn hàng" subtitle="Kiểm tra trạng thái đơn hàng" />
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
            label="Đơn hàng"
            render={(item: Order) => (
              <DataTable.CellText
                value={
                  <>
                    <div className="text-primary font-bold">{item.code}</div>
                    <div className="text-sm text-gray-600">{item.itemCount} món</div>
                  </>
                }
              />
            )}
          />
          <DataTable.Column
            label="Khách hàng"
            render={(item: Order) => (
              <DataTable.CellText
                value={
                  <>
                    <div className="text-gray-800 font-semibold">{item.buyerName}</div>
                    <div className="text-sm text-gray-600">{item.buyerPhone} món</div>
                  </>
                }
              />
            )}
          />
          <DataTable.Column
            center
            label="Hình thức lấy hàng"
            render={(item: Order) => (
              <DataTable.CellText
                value={
                  <span className={"font-semibold"}>{`${
                    item.pickupMethod == "DELIVERY" ? "Giao hàng" : "Lấy tại cửa hàng"
                  }${item.pickupTime ? `(${item.pickupTime})` : ""}`}</span>
                }
              />
            )}
          />
          <DataTable.Column
            center
            label="Thanh toán"
            render={(item: Order) => <DataTable.CellText value={item.paymentMethod} />}
          />
          <DataTable.Column
            center
            label="Ngày tạo"
            render={(item: Order) => (
              <DataTable.CellDate value={item.createdAt} format="dd-MM-yyyy HH:mm" />
            )}
          />
          <DataTable.Column
            center
            label="Trạng thái"
            render={(item: Order) => (
              <DataTable.CellStatus value={item.status} options={ORDER_STATUS} />
            )}
          />
          <DataTable.Column
            right
            label="Tổng tiền"
            render={(item: Order) => <DataTable.CellNumber currency value={item.amount} />}
          />
          <DataTable.Column
            right
            render={(item: Order) => (
              <>
                <DataTable.CellButton
                  value={item}
                  icon={<RiEyeLine />}
                  tooltip="Xem chi tiết"
                  onClick={() => {
                    setOrderId(item.id);
                  }}
                />
                {/* <DataTable.CellButton hoverDanger value={item} isDeleteButton /> */}
              </>
            )}
          />
        </DataTable.Table>
        <DataTable.Pagination />
      </DataTable>
      <OrderDetailsDialog
        orderId={orderId}
        isOpen={!!orderId}
        onClose={() => {
          setOrderId("");
        }}
      />
    </>
  );
}
