import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { Context } from "../../context";
import { NotificationModel } from "./notification.model";

const Mutation = {
  readAllNotification: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
    if (ROLES.ADMIN_EDITOR.includes(context.tokenData.role)) {
      await NotificationModel.updateMany(
        { userId: context.tokenData._id },
        { $set: { seen: true } }
      );
    } else {
      await NotificationModel.updateMany(
        { staffId: context.tokenData._id },
        { $set: { seen: true } }
      );
    }
    return true;
  },
};

export default { Mutation };
