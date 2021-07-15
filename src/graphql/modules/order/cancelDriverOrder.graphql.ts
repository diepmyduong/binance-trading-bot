import { gql } from "apollo-server-express";
import { remove } from "lodash";
import { ROLES } from "../../../constants/role.const";
import { ErrorHelper } from "../../../helpers";
import { Context } from "../../context";
import { DriverModel, DriverStatus } from "../driver/driver.model";
import { OrderModel, OrderStatus, ShipMethod } from "./order.model";

export default {
  schema: gql`
    extend type Mutation {
      cancelDriverOrder(orderId: ID!, comment: String): Order
    }
  `,
  resolver: {
    Mutation: {
      cancelDriverOrder: async (root: any, args: any, context: Context) => {
        context.auth(ROLES.MEMBER_STAFF);
        const { orderId, comment } = args;
        let order = await OrderModel.findById(orderId);
        if (!order) throw Error("Không tìm thấy đơn hàng");
        if (order.sellerId.toString() != context.sellerId) throw ErrorHelper.permissionDeny();
        if (order.status != OrderStatus.CONFIRMED) throw Error("Không thể huỷ tài xế đơn này.");
        if (order.shipMethod != ShipMethod.DRIVER)
          throw Error("Đơn không được chuyển cho Tài xế nội bộ");
        const driver = await DriverModel.findById(order.driverId);
        remove(driver.orderIds, (id) => id.toString() == order._id.toString());
        if (driver.orderIds.length == 0) {
          driver.status == DriverStatus.ONLINE;
        }
        await driver.save();

        order = await OrderModel.findOneAndUpdate(
          { _id: order._id },
          {
            $unset: { shipMethod: 1, deliveryInfo: 1, driverId: 1, driverName: 1, driverPhone: 1 },
            $set: { note: comment },
          },
          { new: true }
        );
        return order;
      },
    },
  },
};
