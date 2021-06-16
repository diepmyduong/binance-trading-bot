import { gql } from "apollo-server-express";
import { ROLES } from "../../../constants/role.const";
import { onMemberDelivering } from "../../../events/onMemberDelivering.event";
import { Context } from "../../context";
import { DriverModel } from "../driver/driver.model";
import { OrderModel, OrderStatus } from "../order/order.model";

export default {
  schema: gql`
    extend type Order {
      "Mã tài xế"
      driverId: ID
      "Tên tài xế"
      driverName: String
      "Điện thoại tài xế"
      driverPhone: String
      "Biển số xe tài xế"
      driverLicense: String
    }
    extend type Mutation {
      transferOrderToDriver(orderId: ID!, driverId: ID!, note: String): Order
    }
  `,
  resolver: {
    Mutation: {
      transferOrderToDriver: async (root: any, args: any, context: Context) => {
        context.auth([ROLES.MEMBER]);
        const { orderId, driverId, note } = args;
        let [order, driver] = await Promise.all([
          OrderModel.findById(orderId),
          DriverModel.findById(driverId),
        ]);
        if (!order) throw Error("Đơn hàng không đúng.");
        if (!driver) throw Error("Tài xế không đúng.");
        if (order.status != OrderStatus.CONFIRMED) throw Error("Đơn hàng này không thể giao.");
        order.driverId = driver._id;
        order.driverName = driver.name;
        order.driverPhone = driver.phone;
        order.driverLicense = driver.licensePlates;
        order = await order.save();
        onMemberDelivering.next(order);
        return order;
      },
    },
  },
};
