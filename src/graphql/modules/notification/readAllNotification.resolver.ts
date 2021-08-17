import { ROLES } from "../../../constants/role.const";
import { Context } from "../../context";

const Mutation = {
  readAllNotification: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ADMIN_EDITOR);
    return true;
  },
};

export default { Mutation };
