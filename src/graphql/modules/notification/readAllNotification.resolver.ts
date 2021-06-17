import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { Context } from "../../context";
import { NotificationModel, NotificationTarget } from "./notification.model";

const Mutation = {
  readAllNotification: async (root: any, args: any, context: Context) => {
    context.auth([ROLES.MEMBER, ROLES.STAFF]);
    if (context.isMember()) {
      await NotificationModel.updateMany(
        { target: NotificationTarget.MEMBER, memberId: context.id, seen: false },
        { $set: { seen: true, seenAt: new Date() } }
      );
    } else {
      await NotificationModel.updateMany(
        { target: NotificationTarget.STAFF, staffId: context.id, seen: false },
        { $set: { seen: true, seenAt: new Date() } }
      );
    }
    return true;
  },
};

export default { Mutation };
