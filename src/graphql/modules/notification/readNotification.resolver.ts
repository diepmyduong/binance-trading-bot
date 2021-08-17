import { ROLES } from "../../../constants/role.const";
import { notFoundHandler } from "../../../helpers/common";
import { Context } from "../../context";
import { NotificationModel } from "./notification.model";

const Mutation = {
  readNotification: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ADMIN_EDITOR);
    const { notificationId } = args;
    const notification = notFoundHandler(await NotificationModel.findById(notificationId));
    if (notification.seen) return notification;
    notification.seen = true;
    notification.sentAt = new Date();
    return notification.save();
  },
};

export default { Mutation };
