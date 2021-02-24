import { set } from "lodash";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { Context } from "../../context";
import { deliveryLogService } from "./deliveryLog.service";

const Query = {
  getAllDeliveryLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER_CUSTOMER);
    if (context.isCustomer()) {
      set(args, 'q.filter.customerId', context.id);
    }
    if (context.isMember()) {
      set(args, 'q.filter.customerId', context.id);
    }
    return deliveryLogService.fetch(args.q);
  },
};


const DeliveryLog = {
  
};

export default {
  Query,
  DeliveryLog,
};
