import { set, isNull } from "lodash";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { Context } from "../../context";
import { CustomerLoader, CustomerModel } from "../customer/customer.model";
import { MemberLoader, MemberModel } from "../member/member.model";
import { OrderItemLoader } from "../orderItem/orderItem.model";
import { UserLoader } from "../user/user.model";
import { orderService } from "./order.service";
import {
  getShipMethods,
  IOrder,
  OrderStatus,
  PaymentMethod,
  ShipMethod,
} from "./order.model";
import { CollaboratorLoader, CollaboratorModel, ICollaborator } from "../collaborator/collaborator.model";
import {
  AddressDeliveryLoader,
  AddressDeliveryModel,
} from "../addressDelivery/addressDelivery.model";
import {
  AddressStorehouseLoader,
  AddressStorehouseModel,
} from "../addressStorehouse/addressStorehouse.model";

const Query = {
  // neu la admin
  getAllOrder: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER_CUSTOMER);

    if (context.isMember()) {
      if (!isNull(args.q.filter.sellerId)) {
        delete args.q.filter.sellerId;
      }
      set(args, "q.filter.sellerId", context.id);
    } else if (context.isCustomer()) {
      set(args, "q.filter.buyerId", context.id);
    }
    else {
      if (args.q.filter) {
        delete args.q.filter.isPrimary;
      }
    }

    return orderService.fetch(args.q);
  },
  getOneOrder: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER_CUSTOMER);
    const { id } = args;
    return await orderService.findOne({ _id: id });
  },

  getTransferedOrders: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);

    if (context.isMember()) {
      set(args, "q.filter.toMemberId", context.id);
    }

    return orderService.fetch(args.q);
  },
};

const Mutation = {};

const Order = {
  items: GraphQLHelper.loadManyById(OrderItemLoader, "itemIds"),
  seller: GraphQLHelper.loadById(MemberLoader, "sellerId"),
  fromMember: GraphQLHelper.loadById(MemberLoader, "fromMemberId"),
  toMember: GraphQLHelper.loadById(MemberLoader, "toMemberId"),
  updatedByUser: GraphQLHelper.loadById(UserLoader, "updatedByUserId"),
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
        if(member.code !== address.code){
          return true
        }
        return false;
      }

      if (root.shipMethod === ShipMethod.VNPOST) {
        const address = await AddressStorehouseLoader.load(root.addressStorehouseId);
        if(member.code !== address.code){
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

  // paymentStatusText: async (root: IOrder, args: any, context: Context) => {
  //   switch (root.paymentStatus) {
  //     case PaymentStatus.PENDING:
  //       return `Đang chờ thanh toán`;
  //     case PaymentStatus.PAID:
  //       return `Đã thanh toán`;
  //     case PaymentStatus.CANCELED:
  //       return `Đã huỷ thanh toán`;
  //     default:
  //       return root.paymentStatus;
  //   }
  // },

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
        return root.shipMethod;
    }
  },
};

export default {
  Query,
  Mutation,
  Order,
};