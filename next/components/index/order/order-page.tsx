import { TabGroup } from "../../shared/utilities/tab/tab-group";
import { Billed } from "./component/billed";
import { useOrderContext } from "./providers/order-provider";
import { Spinner } from "../../shared/utilities/spinner";
import { ORDER_STATUS, Order } from "../../../lib/repo/order.repo";
import { SwitchTabs } from "../../shared/utilities/tab/switch-tabs";
import { useEffect, useState } from "react";
import cloneDeep from "lodash/cloneDeep";

export function OrderPage() {
  const { orders, statusOrder } = useOrderContext();
  return (
    <div className="w-full relative">
      <h3 className="text-lg font-semibold text-primary p-4 bg-white">Danh sách đơn hàng</h3>
      {orders ? (
        <>
          {orders.length > 0 ? (
            <>
              {orders.map((order, index) => (
                <Billed
                  order={order}
                  key={index}
                  status={statusOrder.find((stus) => stus.value === order.status)}
                />
              ))}
            </>
          ) : (
            <div className="px-4 text-center mt-20">Chưa có đơn hàng thuộc trạng thái này</div>
          )}
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
}
