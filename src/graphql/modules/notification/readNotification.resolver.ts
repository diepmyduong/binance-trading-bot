import { ROLES } from "../../../constants/role.const";
import { Context } from "../../context";
import { NotificationModel } from "./notification.model";
import { ErrorHelper } from "../../../helpers/error.helper";

const Mutation = {
  readNotification: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ADMIN_EDITOR);
    const { notificationId } = args;
    const notification = await NotificationModel.findById(notificationId);
    if (!notification) throw ErrorHelper.mgRecoredNotFound("Thông báo");
    if (notification.seen) return notification;
    notification.seen = true;
    notification.sentAt = new Date();
    return notification.save();
  },
};

export default { Mutation };
