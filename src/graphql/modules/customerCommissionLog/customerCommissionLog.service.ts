import { CrudService } from "../../../base/crudService";
import { CustomerPointLogModel } from "../customerPointLog/customerPointLog.model";
import {
  CustomerCommissionLogModel,
  CustomerCommissionLogType,
} from "./customerCommissionLog.model";

const {
  RECEIVE_COMMISSION_2_FROM_ORDER,
  RECEIVE_COMMISSION_2_FROM_REGI_SERVICE,
  RECEIVE_COMMISSION_2_FROM_SMS,
} = CustomerCommissionLogType;
class CustomerCommissionLogService extends CrudService<
  typeof CustomerCommissionLogModel
> {
  constructor() {
    super(CustomerCommissionLogModel);
  }

  // orderId: string; // Mã đơn hàng
  // regisSMSId: string; // Mã đăng ký SMS
  // regisServiceId: string; //Mã đăng ký dịch vụ
  payOneCommission = async ({ customerId, memberId, id, type, commission }: any) => {
    let params: any = {
      customerId,
      memberId,
      type,
      value: commission,
    };

    if (type === RECEIVE_COMMISSION_2_FROM_ORDER) params.orderId = id;
    if (type === RECEIVE_COMMISSION_2_FROM_SMS) params.regisSMSId = id;
    if (type === RECEIVE_COMMISSION_2_FROM_REGI_SERVICE)
      params.regisServiceId = id;

    const commissionLog = new CustomerCommissionLogModel(params);
    return await commissionLog.save();
  };
}

const customerCommissionLogService = new CustomerCommissionLogService();

export { customerCommissionLogService };
