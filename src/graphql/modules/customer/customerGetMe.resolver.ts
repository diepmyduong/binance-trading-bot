import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { Context } from "../../context";
import { CustomerModel } from "./customer.model";

const Query = {
  customerGetMe: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.CUSTOMER]);
    return await CustomerModel.findById(context.id);
  },
};

export default { Query };
