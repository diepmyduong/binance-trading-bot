import { SettingKey } from "../../../../configs/settingData";
import { Context } from "../../../context";
import { SettingHelper } from "../../setting/setting.helper";
import { PaymentMethod, ShipMethod } from "../order.model";

const Query = {
  getAllPaymentMethod: async (root: any, args: any, context: Context) => {
    return [
      { label: "Không áp dụng PTTT", value: PaymentMethod.NONE},
      { label: "Thanh toán khi nhận hàng (COD)", value: PaymentMethod.COD},
    ];
  },
};

export default { Query };
