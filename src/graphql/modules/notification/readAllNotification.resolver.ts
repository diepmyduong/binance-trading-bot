import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { Context } from "../../context";
import { NotificationModel, NotificationTarget } from "./notification.model";

const Mutation = {
  readAllNotification: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ADMIN_EDITOR);
    return true;
  },
};

export default { Mutation };
