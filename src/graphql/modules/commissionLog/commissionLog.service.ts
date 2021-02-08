import { CrudService } from "../../../base/crudService";
import { CommissionLogModel, CommissionLogType } from "./commissionLog.model";
const {
  RECEIVE_COMMISSION_1_FROM_ORDER,
  RECEIVE_COMMISSION_1_FROM_SMS,
  RECEIVE_COMMISSION_1_FROM_REGI_SERVICE,

  RECEIVE_COMMISSION_2_FROM_ORDER,
  RECEIVE_COMMISSION_2_FROM_REGI_SERVICE,
  RECEIVE_COMMISSION_2_FROM_SMS,
} = CommissionLogType;

class CommissionLogService extends CrudService<typeof CommissionLogModel> {
  constructor() {
    super(CommissionLogModel);
  }


  // orderId: string; // Mã đơn hàng
  // regisSMSId: string; // Mã đăng ký SMS
  // regisServiceId: string; //Mã đăng ký dịch vụ
  payOneCommission = async ({ memberId, id, type, commission }: any) => {
    let params: any = {
      memberId,
      type,
      value: commission,
    };

    if (type === RECEIVE_COMMISSION_1_FROM_ORDER || type === RECEIVE_COMMISSION_2_FROM_ORDER)
      params.orderId = id;
    if (type === RECEIVE_COMMISSION_1_FROM_SMS || type === RECEIVE_COMMISSION_2_FROM_SMS)
      params.regisSMSId = id;
    if (type === RECEIVE_COMMISSION_1_FROM_REGI_SERVICE || type === RECEIVE_COMMISSION_2_FROM_REGI_SERVICE)
      params.regisServiceId = id;

    const commissionLog = new CommissionLogModel(params);
    return await commissionLog.save();
  }
}

const commissionLogService = new CommissionLogService();



export { commissionLogService };
