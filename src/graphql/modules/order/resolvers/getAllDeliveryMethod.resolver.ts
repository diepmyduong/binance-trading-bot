import { SettingKey } from "../../../../configs/settingData";
import { Context } from "../../../context";
import { SettingHelper } from "../../setting/setting.helper";
import { ShipMethod } from "../order.model";

const Query = {
  getAllDeliveryMethod: async (root: any, args: any, context: Context) => {
    const [enabledVNPost] = await SettingHelper.loadMany([
      SettingKey.DELIVERY_ENABLED_VNPOST,
    ]);
    return [
      { label: "Tự liên hệ", value: ShipMethod.NONE},
      { label: "Nhận hàng tại chi nhánh", value: ShipMethod.POST },
      ...(enabledVNPost
        ? [{ label: "Giao hàng VNPost", value: ShipMethod.VNPOST }]
        : []),
    ];
  },
};

export default { Query };
