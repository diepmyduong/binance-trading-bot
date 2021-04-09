import { ROLES } from "../../../../constants/role.const";
import { AuthHelper } from "../../../../helpers";
import { Context } from "../../../context";
import { AddressDeliveryLoader, AddressDeliveryModel } from "../../addressDelivery/addressDelivery.model";
import { AddressStorehouseLoader, AddressStorehouseModel } from "../../addressStorehouse/addressStorehouse.model";
import { GraphQLHelper } from "../../../../helpers/graphql.helper";
import { MemberLoader, MemberModel } from "../../member/member.model";
import { CustomerLoader, CustomerModel } from "../../customer/customer.model";
import { getShipMethods, IOrder, OrderLoader, OrderModel, OrderStatus, PaymentMethod, ShipMethod } from "../../order/order.model";
import { ObjectId } from "bson";
import { OrderLogLoader } from "../../orderLog/orderLog.model";
import { orderService } from "../../order/order.service";
import { OrderItemLoader } from "../../orderItem/orderItem.model";
import { CollaboratorModel } from "../../collaborator/collaborator.model";
import { set } from "lodash";
import { type } from "os";
import { Types } from "mongoose";

const getOrderReportsOverview = async (root: any, args: any, context: Context) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
  let { fromDate, toDate, sellerIds, isLate } = args;

  let $gte: Date = null,
    $lte: Date = null;


  if (fromDate) {
    fromDate = fromDate + "T00:00:00+07:00";
    $gte = new Date(fromDate);
  }

  if (toDate) {
    toDate = toDate + "T24:00:00+07:00";
    $lte = new Date(toDate);
  }

  const params = {};

  if ($gte) {
    set(params, "createdAt.$gte", $gte);
  }

  if ($lte) {
    set(params, "loggedAt.$lte", $lte);
  }

  if (context.isMember()) {
    set(params, "sellerId.$in", [new ObjectId(context.id)]);
  }
  else {
    if (sellerIds) {
      if (sellerIds.length > 0) {
        set(params, "sellerId.$in", sellerIds.map(Types.ObjectId));
      }
    }
  }

  console.log('params',params);

  if (isLate === true) {
    set(params, "isLate", isLate);
  }


  const [
    allOrdersCount, [allOrderSum],
    pendingOrdersCount, [pendingOrderSum],
    confirmedOrdersCount, [confirmedOrderSum],
  ] = await Promise.all([
    OrderModel.count(params),
    OrderModel.aggregate([
      { $match: { ...params } },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount"
          }
        }
      },
    ]),

    OrderModel.count({ ...params, status: OrderStatus.PENDING }),
    OrderModel.aggregate([
      { $match: { ...params, status: OrderStatus.PENDING } },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount"
          }
        }
      },
    ]),

    OrderModel.count({ ...params, status: OrderStatus.CONFIRMED }),
    OrderModel.aggregate([
      { $match: { ...params, status: OrderStatus.CONFIRMED } },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount"
          }
        }
      },
    ]),
  ]);

  const [
    deliveringOrdersCount, [deliveringOrderSum],
    completedOrdersCount, [completedOrderSum],
    failureOrdersCount, [failureOrderSum]
  ] = await Promise.all([
    OrderModel.count({ ...params, status: OrderStatus.DELIVERING }),
    OrderModel.aggregate([
      { $match: { ...params, status: OrderStatus.DELIVERING } },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount"
          }
        }
      },
    ]),

    OrderModel.count({ ...params, status: OrderStatus.COMPLETED }),
    OrderModel.aggregate([
      { $match: { ...params, status: OrderStatus.COMPLETED } },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount"
          }
        }
      },
    ]),

    OrderModel.count({ ...params, status: OrderStatus.FAILURE }),
    OrderModel.aggregate([
      { $match: { ...params, status: OrderStatus.FAILURE } },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount"
          }
        }
      },
    ]),
  ]);

  const [
    canceledOrdersCount, [canceledOrderSum],
  ] = await Promise.all([
    OrderModel.count({ ...params, status: OrderStatus.CANCELED }),
    OrderModel.aggregate([
      { $match: { ...params, status: OrderStatus.CANCELED } },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount"
          }
        }
      },
    ]),
  ])

  const allOrders = {
    count: allOrdersCount,
    sum: allOrderSum?.total ? allOrderSum?.total : 0,
  }

  const pendingOrders = {
    count: pendingOrdersCount,
    sum: pendingOrderSum?.total ? pendingOrderSum?.total : 0,
  }

  const confirmedOrders = {
    count: confirmedOrdersCount,
    sum: confirmedOrderSum?.total ? confirmedOrderSum?.total : 0,
  }

  const deliveringOrders = {
    count: deliveringOrdersCount,
    sum: deliveringOrderSum?.total ? deliveringOrderSum?.total : 0,
  }

  const completedOrders = {
    count: completedOrdersCount,
    sum: completedOrderSum?.total ? allOrderSum?.total : 0,
  }

  const failureOrders = {
    count: failureOrdersCount,
    sum: failureOrderSum?.total ? failureOrderSum?.total : 0,
  }

  const canceledOrders = {
    count: canceledOrdersCount,
    sum: canceledOrderSum?.total ? canceledOrderSum?.total : 0,
  }

  return {
    allOrders,
    pendingOrders,
    confirmedOrders,
    deliveringOrders,
    completedOrders,
    failureOrders,
    canceledOrders
  }
};

const getOrderReports = async (root: any, args: any, context: Context) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
  const queryInput = args.q;
  let { fromDate, toDate, sellerIds } = queryInput.filter;


  let $gte: Date = null,
    $lte: Date = null;

  if (fromDate) {
    fromDate = fromDate + "T00:00:00+07:00";
    $gte = new Date(fromDate);
  }

  if (toDate) {
    toDate = toDate + "T24:00:00+07:00";
    $lte = new Date(toDate);
  }

  if ($gte) {
    set(args, "q.filter.createdAt.$gte", $gte);
  }

  if ($lte) {
    set(args, "q.filter.loggedAt.$lte", $lte);
  }

  if (context.isMember()) {
    set(args, "q.filter.sellerId.$in", [context.id]);
  }
  else {
    if (sellerIds) {
      if (sellerIds.length > 0) {
        set(args, "sellerId.$in", sellerIds.map(Types.ObjectId));
      }
      else{
        delete args.q.filter.sellerIds;
      }
    }
  }

  delete args.q.filter.fromDate;
  delete args.q.filter.toDate;

  // console.log('args',args);

  return orderService.fetch(args.q);
};

const OverviewOrder = {
  orderLogs: GraphQLHelper.loadManyById(OrderLogLoader, "orderLogIds"),
  items: GraphQLHelper.loadManyById(OrderItemLoader, "itemIds"),
  seller: GraphQLHelper.loadById(MemberLoader, "sellerId"),
  fromMember: GraphQLHelper.loadById(MemberLoader, "fromMemberId"),
  toMember: GraphQLHelper.loadById(MemberLoader, "toMemberId"),
  buyer: GraphQLHelper.loadById(CustomerLoader, "buyerId"),
  collaborator: async (root: IOrder, args: any, context: Context) => {
    const collaborator = await CollaboratorModel.findById(root.collaboratorId);
    const member = await MemberModel.findById(root.sellerId);
    const collaboratorMember: any = {
      memberId: context.id,
      member
    }
    if (collaborator) {
      const customer = await CustomerModel.findById(collaborator.customerId);
      collaboratorMember.id = collaborator.id;
      collaboratorMember.customerId = collaborator.customerId;
      collaboratorMember.name = collaborator.name;
      collaboratorMember.phone = collaborator.phone;
      collaboratorMember.customer = customer;
    }
    return collaboratorMember;
  },

  mustTransfer: async (root: IOrder, args: any, context: Context) => {
    const member = await MemberModel.findById(root.sellerId);
    if (member) {
      if (root.shipMethod === ShipMethod.POST) {
        const address = await AddressDeliveryLoader.load(root.addressDeliveryId);
        if (member.code !== address.code) {
          return true
        }
        return false;
      }

      if (root.shipMethod === ShipMethod.VNPOST) {
        const address = await AddressStorehouseLoader.load(root.addressStorehouseId);
        if (member.code !== address.code) {
          return true
        }
        return false
      }
      return false
    }
    return false;
  },

  addressStorehouse: GraphQLHelper.loadById(
    AddressStorehouseLoader,
    "addressStorehouseId"
  ),
  addressDelivery: GraphQLHelper.loadById(
    AddressDeliveryLoader,
    "addressDeliveryId"
  ),

  deliveringMember: async (root: IOrder, args: any, context: Context) => {
    if (root.toMemberId) {
      return await MemberModel.findById(root.toMemberId);
    }

    let code = null;
    if (root.shipMethod === ShipMethod.POST) {
      const addressDelivery = await AddressDeliveryModel.findById(
        root.addressDeliveryId
      );
      code = addressDelivery.code;
    }

    if (root.shipMethod === ShipMethod.VNPOST) {
      const addressStorehouse = await AddressStorehouseModel.findById(
        root.addressStorehouseId
      );

      code = addressStorehouse.code;
    }

    const result = await MemberModel.findOne({ code });

    if (!result)
      return await MemberModel.findById(root.sellerId);

    return result;
  },

  paymentMethodText: async (root: IOrder, args: any, context: Context) => {
    switch (root.paymentMethod) {
      case PaymentMethod.COD:
        return `Thanh toán khi nhận hàng (COD)`;
      case PaymentMethod.NONE:
        return `Không áp dụng PTTT`;
      default:
        return root.paymentMethod;
    }
  },

  shipMethodText: async (root: IOrder, args: any, context: Context) => {
    const shipMethods = await getShipMethods();
    const shipMethod = shipMethods.find(
      (ship) => ship.value === root.shipMethod
    );
    return shipMethod ? shipMethod.label : "Không có phương thức này";
  },

  statusText: async (root: IOrder, args: any, context: Context) => {
    switch (root.status) {
      case OrderStatus.PENDING:
        return `Đang xử lý`;
      case OrderStatus.CONFIRMED:
        return `Đã xác nhận`;
      case OrderStatus.DELIVERING:
        return `Đang giao hàng`;
      case OrderStatus.COMPLETED:
        return `Hoàn tất`;
      case OrderStatus.FAILURE:
        return `Thất bại`;
      case OrderStatus.CANCELED:
        return `Đã huỷ`;
      case OrderStatus.RETURNED:
        return `Đã hoàn hàng`;
      default:
        return root.status;
    }
  },

  commission: async (root: IOrder, args: any, context: Context) => {
    return root.commission1 + root.commission2 + root.commission3;
    // console.time('commission' + root.id);
    // const member = await MemberLoader.load(root.sellerId)
    // let total = root.commission1;
    // if (!root.collaboratorId) {
    //   total += root.commission2;
    // }

    // // kiem tra ko co chuyen don
    // if (!root.toMemberId) {
    //   // neu don hoan thanh -> + comm3 cho chu shop
    //   if (root.status === OrderStatus.COMPLETED) {
    //     total += root.commission3;
    //   }
    //   else {
    //     // neu don ko hoan thanh ->
    //     if (root.shipMethod === ShipMethod.POST) {
    //       const address = await AddressDeliveryLoader.load(root.addressDeliveryId);
    //       if (address.code === member.code) {
    //         total += root.commission3;
    //       }
    //     }
    //     if (root.shipMethod === ShipMethod.VNPOST) {
    //       const address = await AddressStorehouseLoader.load(root.addressStorehouseId);
    //       if (address.code === member.code) {
    //         total += root.commission3;
    //       }
    //     }

    //   }
    // }
    // console.timeEnd("commission" + root.id);
    // return total;
  }

}

const Query = {
  getOrderReportsOverview,
  getOrderReports
};

export default {
  Query,
  OverviewOrder
};
