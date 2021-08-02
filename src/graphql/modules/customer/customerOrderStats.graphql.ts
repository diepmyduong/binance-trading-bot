import { gql } from "apollo-server-express";

import LocalBroker from "../../../services/broker";
import { Context } from "../../context";
import { ICustomer } from "./customer.model";

export default {
  schema: gql`
    extend type Customer {
      orderStats: CustomerOrderStats
    }
    type CustomerOrderStats {
      "Tổng doanh số"
      revenue: Float
      "Tổng số lượng voucher sử dụng"
      voucher: Int
      "Tổng giảm giá"
      discount: Float
      "Tổng đơn hàng"
      total: Int
      "Tỏng đơn huỷ"
      completed: Int
      "Tổng đơn huỷ"
      canceled: Int
    }
  `,
  resolver: {
    Customer: {
      orderStats: async (root: ICustomer, args: any, context: Context) => {
        return LocalBroker.call("customerContext.estimateOrder", {
          customerId: root._id.toString(),
        });
      },
    },
  },
};
