import { ROLES } from "../../../constants/role.const";
import { Context } from "../../context";
import { NotificationModel } from "./notification.model";
import { ErrorHelper } from "../../../helpers/error.helper";

const Mutation = {
  readNotification: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.MEMBER_STAFF_CUSTOMER);
    const { notificationId } = args;
    const notification = await NotificationModel.findById(notificationId);
    if (!notification) throw ErrorHelper.mgRecoredNotFound("Thông báo");
    if (context.isMember() && notification.memberId.toString() != context.id)
      throw ErrorHelper.permissionDeny();
    if (context.isStaff() && notification.staffId.toString() != context.id)
      throw ErrorHelper.permissionDeny();
    if (context.isCustomer() && notification.customerId.toString() != context.id)
      throw ErrorHelper.permissionDeny();
    if (notification.seen) return notification;
    notification.seen = true;
    notification.sentAt = new Date();
    return notification.save();
  },
};

export default { Mutation };
