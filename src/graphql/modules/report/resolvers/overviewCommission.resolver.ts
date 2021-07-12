import { get, set } from "lodash";
import { ObjectId } from "mongodb";
import { Types } from "mongoose";

import { ROLES } from "../../../../constants/role.const";
import { AuthHelper, UtilsHelper } from "../../../../helpers";
import { GraphQLHelper } from "../../../../helpers/graphql.helper";
import { Context } from "../../../context";
import { AddressDeliveryLoader } from "../../addressDelivery/addressDelivery.model";
import { AddressStorehouseLoader } from "../../addressStorehouse/addressStorehouse.model";
import { CollaboratorLoader } from "../../collaborator/collaborator.model";
import { CustomerLoader } from "../../customer/customer.model";
import { MemberLoader, MemberModel } from "../../member/member.model";
import {
  getShipMethods,
  IOrder,
  OrderModel,
  OrderStatus,
  PaymentMethod,
  ShipMethod,
} from "../../order/order.model";
import { orderService } from "../../order/order.service";
import { OrderItemLoader } from "../../orderItem/orderItem.model";
import { OrderLogLoader } from "../../orderLog/orderLog.model";

const getCommissionReportsOverview = async (root: any, args: any, context: Context) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
  const { memberIds, $match }: { memberIds: Types.ObjectId[]; $match: any } = await getMatchQuery(
    args,
    context
  );
  const isFromMember = memberIds.length > 0 ? { $in: ["$fromMemberId", memberIds] } : true;
  const isToMember = memberIds.length > 0 ? { $in: ["$toMemberId", memberIds] } : true;
  const isCollaborator = { $ne: [{ $ifNull: ["$collaboratorId", 0] }, 0] };
  const notCollaborator = { $eq: [{ $ifNull: ["$collaboratorId", 0] }, 0] };
  const statusComplete = { $in: ["$status", ["COMPLETED"]] };
  const statusUncomplete = { $in: ["$status", ["PENDING", "CONFIRMED", "DELIVERING"]] };
  const commission1Cond: any = { $and: [isFromMember, statusComplete] };
  const commission2Cond: any = { $and: [notCollaborator, isFromMember, statusComplete] };
  const commission21Cond: any = { $and: [isCollaborator, statusComplete] };
  const commission3Cond: any = { $and: [isToMember, statusComplete] };
  const uncommission1Cond: any = { $and: [isFromMember] };
  const uncommission2Cond: any = { $and: [notCollaborator, isFromMember] };
  const uncommission21Cond: any = { $and: [isCollaborator] };
  const uncommission3Cond: any = { $and: [isToMember] };

  const query: any = [
    { $match: $match },
    {
      $project: getFieldProject(),
    },
    { $addFields: { toMemberId: { $ifNull: ["$toMemberId", "$sellerId"] } } },
    {
      $addFields: {
        commission1: { $cond: [commission1Cond, "$commission1", 0] },
        commission2: { $cond: [commission2Cond, "$commission2", 0] },
        commission21: { $cond: [commission21Cond, "$commission2", 0] },
        commission3: { $cond: [commission3Cond, "$commission3", 0] },
        unCompletedCommission1: { $cond: [uncommission1Cond, "$commission1", 0] },
        unCompletedcommission2: { $cond: [uncommission2Cond, "$commission2", 0] },
        unCompletedcommission21: { $cond: [uncommission21Cond, "$commission2", 0] },
        unCompletedcommission3: { $cond: [uncommission3Cond, "$commission3", 0] },
        completeOrder: { $cond: [statusComplete, 1, 0] },
        uncompleteOrder: { $cond: [statusUncomplete, 1, 0] },
      },
    },
    {
      $group: {
        _id: null,
        completeOrder: { $sum: "$completeOrder" },
        uncompleteOrder: { $sum: "$uncompleteOrder" },
        commission1: { $sum: "$commission1" },
        commission2: { $sum: "$commission2" },
        commission21: { $sum: "$commission21" },
        commission3: { $sum: "$commission3" },
        unCompletedCommission1: { $sum: "$unCompletedCommission1" },
        unCompletedcommission2: { $sum: "$unCompletedcommission2" },
        unCompletedcommission21: { $sum: "$unCompletedcommission21" },
        unCompletedcommission3: { $sum: "$unCompletedcommission3" },
        totalCommission: {
          $sum: { $add: ["$commission1", "$commission2", "$commission21", "$commission3"] },
        },
        totalUnCompletedCommission: {
          $sum: {
            $add: [
              "$unCompletedCommission1",
              "$unCompletedcommission2",
              "$unCompletedcommission21",
              "$unCompletedcommission3",
            ],
          },
        },
      },
    },
  ];
  const result = await OrderModel.aggregate(query).then((res) =>
    get(res, "0", {
      completeOrder: 0,
      uncompleteOrder: 0,
      commission1: 0,
      commission2: 0,
      commission21: 0,
      commission3: 0,
      unCompletedCommission1: 0,
      unCompletedcommission2: 0,
      unCompletedcommission21: 0,
      unCompletedcommission3: 0,
      totalCommission: 0,
      totalUnCompletedCommission: 0,
    })
  );
  return result;
};

const getCommissionReports = async (root: any, args: any, context: Context) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
  const { memberIds, $match }: { memberIds: Types.ObjectId[]; $match: any } = await getMatchQuery(
    args.q.filter,
    context
  );
  set(args, "q.filter", $match);
  return orderService.fetch(args.q);
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
    const { commission2, collaboratorId, sellerId } = root;
    if (collaboratorId) {
      const collaborator = await CollaboratorLoader.load(collaboratorId);
      return {
        code: collaborator.code,
        name: collaborator.name,
        type: "CTV",
        value: commission2,
      };
    } else {
      const member = await MemberModel.findById(sellerId);
      return {
        code: member.code,
        name: member.name,
        type: "Cửa Hàng",
        value: commission2,
      };
    }
  },

  commission1Details: async (root: IOrder, args: any, context: Context) => {
    const { commission1, sellerId } = root;
    const member = await MemberLoader.load(sellerId);
    return {
      code: member.code,
      name: member.shopName,
      type: "Cửa Hàng",
      value: commission1,
    };
  },

  commission3Details: async (root: IOrder, args: any, context: Context) => {
    const {
      commission3,
      sellerId,
      toMemberId,
      status,
      shipMethod,
      addressDeliveryId,
      addressStorehouseId,
    } = root;
    if (toMemberId) {
      const member = await MemberLoader.load(toMemberId);
      return {
        code: member.code,
        name: member.shopName,
        type: "Cửa Hàng giao hàng",
        value: commission3,
      };
    } else {
      if (status === OrderStatus.COMPLETED) {
        const member = await MemberLoader.load(sellerId);
        return {
          code: member.code,
          name: member.shopName,
          type: "Cửa Hàng giao hàng",
          value: commission3,
        };
      } else {
        if (shipMethod === ShipMethod.POST) {
          const address = await AddressDeliveryLoader.load(addressDeliveryId);
          const member = await MemberModel.findOne({ code: address.code });
          return {
            code: member.code,
            name: member.shopName,
            type: "Cửa Hàng giao hàng",
            value: commission3,
          };
        }
        if (shipMethod === ShipMethod.VNPOST) {
          const address = await AddressStorehouseLoader.load(addressStorehouseId);
          const member = await MemberModel.findOne({ code: address.code });
          return {
            code: member.code,
            name: member.shopName,
            type: "Cửa Hàng giao hàng",
            value: commission3,
          };
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
          return true;
        }
        return false;
      }

      if (root.shipMethod === ShipMethod.VNPOST) {
        const address = await AddressStorehouseLoader.load(root.addressStorehouseId);
        if (member.code !== address.code) {
          return true;
        }
        return false;
      }
      return false;
    }
    return false;
  },

  addressStorehouse: GraphQLHelper.loadById(AddressStorehouseLoader, "addressStorehouseId"),
  addressDelivery: GraphQLHelper.loadById(AddressDeliveryLoader, "addressDeliveryId"),

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

    if (!result) return await MemberLoader.load(root.sellerId);

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
    const shipMethod = shipMethods.find((ship) => ship.value === root.shipMethod);
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

  commission: async (
    { commission1, commission2, commission3 }: IOrder,
    args: any,
    context: Context
  ) => commission1 + commission2 + commission3,
};

const Query = {
  getCommissionReportsOverview,
  getCommissionReports,
};

export default {
  Query,
  OverviewCommission,
};
function getFieldProject() {
  return {
    _id: 1,
    sellerId: 1,
    buyerId: 1,
    fromMemberId: 1,
    toMemberId: 1,
    commission1: 1,
    commission2: 1,
    commission3: 1,
    collaboratorId: 1,
    status: 1,
  };
}

async function getMatchQuery(args: any, context: Context) {
  let { fromDate, toDate, sellerIds, branchId, collaboratorId } = args;
  const { $gte, $lte } = UtilsHelper.getDatesWithComparing(fromDate, toDate);

  const $match: any = {};
  if ($gte) set($match, "createdAt.$gte", $gte);
  if ($lte) set($match, "loggedAt.$lte", $lte);

  //theo cửa hàng nào
  const memberIds: Types.ObjectId[] = await getMemberIds(context, branchId, sellerIds);
  if (memberIds.length > 0) {
    set($match, "$or", [
      { sellerId: { $in: memberIds } },
      { fromMemberId: { $in: memberIds } },
      { toMemberId: { $in: memberIds } },
    ]);
  }

  //theo ctv nao
  if (collaboratorId) {
    set($match, "collaboratorId", Types.ObjectId(collaboratorId));
  }
  return { memberIds, $match };
}

async function getMemberIds(context: Context, branchId: any, sellerIds: any) {
  let memberIds: Types.ObjectId[] = [];
  if (context.isMember()) {
    memberIds = [Types.ObjectId(context.id)];
  } else {
    if (branchId) {
      memberIds = await MemberModel.find({ branchId, activated: true })
        .select("_id")
        .then((res) => res.map((r) => r._id));
    } else {
      memberIds = sellerIds.map(Types.ObjectId) || [];
    }
  }
  return memberIds;
}
