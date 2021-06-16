import _ from "lodash";

import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { Context } from "../../context";
import { MemberLoader } from "../member/member.model";
import { OrderLoader } from "../order/order.model";
import { ProductLoader } from "../product/product.model";
import { StaffLoader } from "../staff/staff.model";
import { NotificationTarget } from "./notification.model";
import { notificationService } from "./notification.service";

const Query = {
  getAllNotification: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_CUSTOMER);
    if (context.isMember()) {
      _.set(args, "q.filter.target", NotificationTarget.MEMBER);
      _.set(args, "q.filter.memberId", context.id);
    }
    if (context.isStaff()) {
      _.set(args, "q.filter.target", NotificationTarget.STAFF);
      _.set(args, "q.filter.staffId", context.id);
    }
    return notificationService.fetch(args.q);
  },
  getOneNotification: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_CUSTOMER);
    const { id } = args;
    return await notificationService.findOne({ _id: id });
  },
};

const Notification = {
  order: GraphQLHelper.loadById(OrderLoader, "orderId"),
  product: GraphQLHelper.loadById(ProductLoader, "productId"),
  member: GraphQLHelper.loadById(MemberLoader, "memberId"),
  staff: GraphQLHelper.loadById(StaffLoader, "staffId"),
};

export default {
  Query,
  Notification,
};
