import { set, isNull } from "lodash";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { Context } from "../../context";
import { CustomerLoader } from "../customer/customer.model";
import { MemberLoader } from "../member/member.model";
import { OrderItemLoader } from "../orderItem/orderItem.model";
import { UserLoader } from "../user/user.model";
import { IProduct, ProductModel, ProductType } from "../product/product.model";
import { orderService } from "./order.service";
import { ErrorHelper } from "../../../base/error";
import { onOrderTestSendMess } from "../../../events/onOrderTestSendMess.event";
import { onOrderedProduct } from "../../../events/onOrderedProduct.event";
import { CampaignLoader, CampaignModel } from "../campaign/campaign.model";
import { IOrder, OrderStatus, PaymentMethod, ShipMethod } from "./order.model";
// import { CustomerModel } from "../customer/customer.model";
// import { CrossSaleModel } from "../crossSale/crossSale.model";
// import { crossSaleService } from "../crossSale/crossSale.service";

const Query = {
  // neu la admin
  getAllOrder: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER_CUSTOMER);

    // neu la sellerId
    if (context.isMember()) {
      console.log("args.q.filter", args.q.filter);
      console.log("args.q.filter.isPrimary", args.q.filter);
      if (!isNull(args.q.filter.isPrimary)) {
        delete args.q.filter.isPrimary;
      }
      if (!isNull(args.q.filter.sellerId)) {
        delete args.q.filter.sellerId;
      }
      set(args, "q.filter.sellerId", context.id);
    }

    // neu la buyer id
    if (context.isCustomer()) {
      set(args, "q.filter.buyerId", context.id);
    }

    //ne
    return orderService.fetch(args.q);
  },
  getOneOrder: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER_CUSTOMER);
    const { id } = args;
    return await orderService.findOne({ _id: id });
  },
};

const Mutation = {};

const Order = {
  items: GraphQLHelper.loadManyById(OrderItemLoader, "itemIds"),
  seller: GraphQLHelper.loadById(MemberLoader, "sellerId"),
  fromMember: GraphQLHelper.loadById(MemberLoader, "fromMemberId"),
  updatedByUser: GraphQLHelper.loadById(UserLoader, "updatedByUserId"),
  buyer: GraphQLHelper.loadById(CustomerLoader, "buyerId"),
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
    switch (root.shipMethod) {
      case ShipMethod.NONE:
        return `Không vận chuyển`;
      case ShipMethod.POST:
        return `Nhận hàng tại chị nhánh`;
      case ShipMethod.VNPOST:
        return `Giao hàng VN-Post`;
      default:
        return root.shipMethod;
    }
  },
  statusText: async (root: IOrder, args: any, context: Context) => {
    switch (root.status) {
      case OrderStatus.PENDING:
        return `Chờ xử lý`;
      case OrderStatus.DELIVERING:
        return `Đang giao hàng`;
      case OrderStatus.COMPLETED:
        return `Đã giao`;
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
