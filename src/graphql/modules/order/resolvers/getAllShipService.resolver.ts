import { VietnamPostHelper } from "../../../../helpers/vietnamPost/vietnamPost.helper";
import { ROLES } from "../../../../constants/role.const";
import { Context } from "../../../context";
import { ShipMethod } from "../order.model";

const Query = {
  getAllShipService: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ADMIN_EDITOR);
    const { shipMethod } = args;
    let services: any = [];
    switch (shipMethod) {
      case ShipMethod.VNPOST:
        services = await VietnamPostHelper.getListService();
        break;
      default:
        services = [];
        break;
    }
    // console.log("services", services);
    return services;
  },
};

export default { Query };
