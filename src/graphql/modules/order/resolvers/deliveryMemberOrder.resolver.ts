import { ROLES } from "../../../../constants/role.const";
import { Context } from "../../../context";
import { OrderModel, OrderStatus, ShipMethod} from "../order.model";
import { ErrorHelper } from "../../../../helpers/error.helper";
import {
  VietnamPostHelper,
  ICreateDeliveryOrderRequest,
  PickupType
} from "../../../../helpers/vietnamPost/vietnamPost.helper";
import { MemberModel } from "../../member/member.model";
import { CustomerModel } from "../../customer/customer.model";
import { DeliveryInfo } from "../types/deliveryInfo.type";
import { GetVietnamPostDeliveryStatusText } from "../../../../helpers/vietnamPost/vietnamPostDeliveryStatus";
import { SettingKey } from "../../../../configs/settingData";
import { SettingHelper } from "../../setting/setting.helper";

const Mutation = {
  deliveryMemberOrder: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ADMIN_EDITOR_MEMBER);
    const { id } = args;

    // console.log("id", id);

    let params: any = {
      _id: id,
      status: OrderStatus.CONFIRMED
    };

    
    if (context.isMember()) {
      params.sellerId = context.id;
    }

    const order = await OrderModel.findOne(params);

    if (!order) {
      throw ErrorHelper.mgRecoredNotFound("Đơn hàng");
    }

    order.status = OrderStatus.DELIVERING;
    
    return await order.save();
  },
};

export default { Mutation };
