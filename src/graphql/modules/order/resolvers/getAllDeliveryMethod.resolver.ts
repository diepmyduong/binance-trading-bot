import { SettingKey } from "../../../../configs/settingData";
import { Context } from "../../../context";
import { SettingHelper } from "../../setting/setting.helper";
import { getShipMethods, ShipMethod } from "../order.model";

const Query = {
  getAllDeliveryMethod: async (root: any, args: any, context: Context) => {
    const [enabledVNPost] = await SettingHelper.loadMany([
      SettingKey.DELIVERY_ENABLED_VNPOST,
    ]);
    const shipMethods = await getShipMethods();
    const results = [];
    results.push(shipMethods.find((ship) => ship.value === ShipMethod.NONE));
    results.push(shipMethods.find((ship) => ship.value === ShipMethod.POST));
    enabledVNPost &&
      results.push(
        shipMethods.find((ship) => ship.value === ShipMethod.VNPOST)
      );
    return results;
  },
};

export default { Query };
