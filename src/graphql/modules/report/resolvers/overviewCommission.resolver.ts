
import { ROLES } from "../../../../constants/role.const";
import { AuthHelper, UtilsHelper } from "../../../../helpers";
import { Context } from "../../../context";
import { AddressDeliveryLoader, AddressDeliveryModel } from "../../addressDelivery/addressDelivery.model";
import { AddressStorehouseLoader, AddressStorehouseModel } from "../../addressStorehouse/addressStorehouse.model";
import { GraphQLHelper } from "../../../../helpers/graphql.helper";
import { MemberLoader, MemberModel } from "../../member/member.model";
import { CustomerLoader, CustomerModel } from "../../customer/customer.model";
import { getShipMethods, IOrder, OrderLoader, OrderModel, OrderStatus, PaymentMethod, ShipMethod } from "../../order/order.model";
import { ObjectId } from "mongodb";
import { OrderLogLoader } from "../../orderLog/orderLog.model";
import { orderService } from "../../order/order.service";
import { OrderItemLoader } from "../../orderItem/orderItem.model";
import { CollaboratorLoader, CollaboratorModel } from "../../collaborator/collaborator.model";
import { set } from "lodash";
import { Types } from "mongoose";

const resolveArgs = (args: any) => {
  delete args.q.filter.sellerIds;
  delete args.q.filter.fromDate;
  delete args.q.filter.toDate;
  delete args.q.filter.orderStatus;
  delete args.q.filter.branchId;
}

const getCommissionReportsOverview = async (root: any, args: any, context: Context) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
  let { fromDate, toDate, sellerIds, branchId, collaboratorId } = args;

  const { $gte, $lte } = UtilsHelper.getDatesWithComparing(fromDate, toDate);

  const params = {};

  if ($gte) {
    set(params, "createdAt.$gte", $gte);
  }

  if ($lte) {
    set(params, "loggedAt.$lte", $lte);
  }

  //theo bưu cục nào
  if (context.isMember()) {
    set(params, "sellerId.$in", [context.id]);
  }
  else {
    if (branchId) {
      const members = await MemberModel.find({ branchId, activated: true }).select("_id");;
      const sellerIds = members.map(m => m.id);
      set(params, "sellerId.$in", sellerIds.map(Types.ObjectId));
    }
    else {
      if (sellerIds) {
        if (sellerIds.length > 0) {
          set(params, "sellerId.$in", sellerIds.map(Types.ObjectId));
        }
      }
    }
  }

  //theo ctv nao
  if (collaboratorId) {
    set(params, "collaboratorId", new ObjectId(collaboratorId));
  }

  // console.log('params',params);

  const [order] = await OrderModel.aggregate([
    {
      $match: {
        ...params
      }
    },
    {
      $group: {
        _id: null,
        commission1: { $sum: { $cond: [{ $in: ["$status", ["COMPLETED"]] }, "$commission1", 0] } },
        commission2: { $sum: { $cond: [{ $in: ["$status", ["COMPLETED"]] }, "$commission2", 0] } },
        commission3: { $sum: { $cond: [{ $in: ["$status", ["COMPLETED"]] }, "$commission3", 0] } },

        unCompletedCommission1: { $sum: { $cond: [{ $in: ["$status", ["PENDING", "CONFIRMED", "DELIVERING"]] }, "$commission1", 0] } },
        unCompletedcommission2: { $sum: { $cond: [{ $in: ["$status", ["PENDING", "CONFIRMED", "DELIVERING"]] }, "$commission2", 0] } },
        unCompletedcommission3: { $sum: { $cond: [{ $in: ["$status", ["PENDING", "CONFIRMED", "DELIVERING"]] }, "$commission3", 0] } },
      }
    }
  ]);

  let result = {
    commission1 : 0,
    commission2 : 0,
    commission3 : 0,
    unCompletedCommission1 : 0,
    unCompletedcommission2 : 0,
    unCompletedcommission3 : 0,
    totalCommission: 0,
    totalUnCompletedCommission:0,
  }

  if(order){
    result = {
      ...order,
      totalCommission: order.commission1 + order.commission2 + order.commission3,
      totalUnCompletedCommission: order.unCompletedCommission1 + order.unCompletedcommission2 + order.unCompletedcommission3
    }
  }

  return result;
};

const getCommissionReports = async (root: any, args: any, context: Context) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
  const queryInput = args.q;
  let { fromDate, toDate, sellerIds, collaboratorId, orderStatus, branchId } = queryInput.filter;

  const { $gte, $lte } = UtilsHelper.getDatesWithComparing(fromDate, toDate);

  if ($gte) {
    set(args, "q.filter.createdAt.$gte", $gte);
  }

  if ($lte) {
    set(args, "q.filter.loggedAt.$lte", $lte);
  }

  //theo bưu cục nào
  if (context.isMember()) {
    set(args, "q.filter.sellerId.$in", [context.id]);
  }
  else {
    if (branchId) {
      const memberIds = await MemberModel.find({ branchId, activated: true }).select("_id");
      const sellerIds = memberIds.map(m => m.id);
      set(args, "q.filter.sellerId.$in", sellerIds.map(Types.ObjectId));
    }
    else {
      if (sellerIds) {
        if (sellerIds.length > 0) {
          set(args, "q.filter.sellerId.$in", sellerIds.map(Types.ObjectId));
        }
        else {
          delete args.q.filter.sellerIds;
        }
      }
    }
  }

  //theo ctv nao
  if (collaboratorId) {
    set(args, "q.filter.collaboratorId", new ObjectId(collaboratorId));
  }

  //theo du kien
  if (orderStatus) {
    switch (orderStatus) {
      case "COMPLETED":
        set(args, "q.filter.status", [OrderStatus.COMPLETED]);
        break;
      case "UNCOMPLETED":
        set(args, "q.filter.status", [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.DELIVERING]);
        break;
      default:
        set(args, "q.filter.status", [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.DELIVERING, OrderStatus.COMPLETED]);
        break;
    }
  }

  // theo thuc nhan
  resolveArgs(args);

  // console.log('args', args);
  return orderService.fetch(args.q, '-sellerBonusPoint -buyerBonusPoint -itemWeight -itemWidth -itemLength -itemHeight -isUrbanDelivery -buyerName -buyerPhone -fromMemberId -orderLogIds');
};

const OverviewCommission = {
  orderLogs: GraphQLHelper.loadManyById(OrderLogLoader, "orderLogIds"),
  items: GraphQLHelper.loadManyById(OrderItemLoader, "itemIds"),
  seller: GraphQLHelper.loadById(MemberLoader, "sellerId"),
  fromMember: GraphQLHelper.loadById(MemberLoader, "fromMemberId"),
  toMember: GraphQLHelper.loadById(MemberLoader, "toMemberId"),
  buyer: GraphQLHelper.loadById(CustomerLoader, "buyerId"),
  collaborator: async (root: IOrder, args: any, context: Context) => {
    if (!root.collaboratorId) return null;
    return await CollaboratorLoader.load(root.collaboratorId);
  },

  commission2Details: async (root: IOrder, args: any, context: Context) => {
    const { commission2, collaboratorId, sellerId } = root
    if (collaboratorId) {
      const collaborator = await CollaboratorLoader.load(collaboratorId);
      return {
        code: collaborator.code,
        name: collaborator.name,
        type: "CTV",
        value: commission2
      }
    }
    else {
      const member = await MemberModel.findById(sellerId);
      return {
        code: member.code,
        name: member.name,
        type: "Bưu Cục",
        value: commission2
      }
    }
  },

  commission1Details: async (root: IOrder, args: any, context: Context) => {
    const { commission1, sellerId } = root
    const member = await MemberLoader.load(sellerId);
    return {
      code: member.code,
      name: member.shopName,
      type: "Bưu Cục",
      value: commission1
    }
  },

  commission3Details: async (root: IOrder, args: any, context: Context) => {
    const { commission3, sellerId, toMemberId, status, shipMethod, addressDeliveryId, addressStorehouseId } = root;
    if (toMemberId) {
      const member = await MemberLoader.load(toMemberId);
      return {
        code: member.code,
        name: member.shopName,
        type: "Bưu Cục giao hàng",
        value: commission3
      }
    }
    else {
      if (status === OrderStatus.COMPLETED) {
        const member = await MemberLoader.load(sellerId);
        return {
          code: member.code,
          name: member.shopName,
          type: "Bưu Cục giao hàng",
          value: commission3
        }
      }
      else {
        if (shipMethod === ShipMethod.POST) {
          const address = await AddressDeliveryLoader.load(addressDeliveryId);
          const member = await MemberModel.findOne({ code: address.code });
          return {
            code: member.code,
            name: member.shopName,
            type: "Bưu Cục giao hàng",
            value: commission3
          }
        }
        if (shipMethod === ShipMethod.VNPOST) {
          const address = await AddressStorehouseLoader.load(addressStorehouseId);
          const member = await MemberModel.findOne({ code: address.code });
          return {
            code: member.code,
            name: member.shopName,
            type: "Bưu Cục giao hàng",
            value: commission3
          }
        }

      }
    }
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
      const addressDelivery = await AddressDeliveryLoader.load(root.addressDeliveryId);
      code = addressDelivery.code;
    }

    if (root.shipMethod === ShipMethod.VNPOST) {
      const addressStorehouse = await AddressStorehouseLoader.load(root.addressStorehouseId);
      code = addressStorehouse.code;
    }

    const result = await MemberModel.findOne({ code });

    if (!result)
      return await MemberLoader.load(root.sellerId);

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
        return `Chờ duyệt`;
      case OrderStatus.CONFIRMED:
        return `Xác nhận`;
      case OrderStatus.DELIVERING:
        return `Đang giao`;
      case OrderStatus.COMPLETED:
        return `Hoàn thành`;
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

  commission: async ({ commission1, commission2, commission3 }: IOrder, args: any, context: Context) => commission1 + commission2 + commission3
}

const Query = {
  getCommissionReportsOverview,
  getCommissionReports
};

export default {
  Query,
  OverviewCommission
};
