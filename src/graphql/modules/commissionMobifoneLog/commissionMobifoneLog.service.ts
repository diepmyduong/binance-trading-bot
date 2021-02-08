import { CrudService } from "../../../base/crudService";
import {
  CommissionMobifoneLogModel,
  CommissionMobifoneLogType,
} from "./commissionMobifoneLog.model";
const {
  RECEIVE_COMMISSION_0_FROM_ORDER,
  RECEIVE_COMMISSION_0_FROM_REGI_SERVICE,
  RECEIVE_COMMISSION_0_FROM_SMS,
} = CommissionMobifoneLogType;
class CommissionMobifoneLogService extends CrudService<
  typeof CommissionMobifoneLogModel
> {
  constructor() {
    super(CommissionMobifoneLogModel);
  }

  payOneCommission = ({ id, type, commission }: any) => {
    let params: any = {
      type,
      value: commission,
    };

    if (type === RECEIVE_COMMISSION_0_FROM_ORDER) params.orderId = id;
    if (type === RECEIVE_COMMISSION_0_FROM_SMS) params.regisSMSId = id;
    if (type === RECEIVE_COMMISSION_0_FROM_REGI_SERVICE)
      params.regisServiceId = id;

    console.log("params", params);

    const commissionLog = new CommissionMobifoneLogModel(params);
    return commissionLog.save();
  };
}

const commissionMobifoneLogService = new CommissionMobifoneLogService();

export { commissionMobifoneLogService };
