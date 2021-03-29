import { CommissionLogType } from "../commissionLog.model";
import { Context } from "../../../context";

const Query = {
  getCommissionTypes: async (root: any, args: any, context: Context) => {
    const results = [
      { type: CommissionLogType.RECEIVE_COMMISSION_1_FROM_ORDER, name: "Hoa hồng điểm bán" },
      { type: CommissionLogType.RECEIVE_COMMISSION_2_FROM_ORDER_FOR_COLLABORATOR, name: "Hoa hồng CTV" },
      { type: CommissionLogType.RECEIVE_COMMISSION_3_FROM_ORDER, name: "Hoa hồng giao hàng" },
    ];

    return results;
  }
};


export default {
  Query,
};
