import { CrudService } from "../../../base/crudService";
import {
  CustomerCommissionLogModel,
  CustomerCommissionLogType
} from "./customerCommissionLog.model";

class CustomerCommissionLogService extends CrudService<typeof CustomerCommissionLogModel> {
  constructor() {
    super(CustomerCommissionLogModel);
  }

  payCustomerCommission = async ({ customerId, memberId, id, commission }: any) => {
    const params: any = {
      customerId,
      memberId,
      type: CustomerCommissionLogType.RECEIVE_COMMISSION_2_FROM_ORDER,
      value: commission,
      orderId: id
    };
    const commissionLog = new CustomerCommissionLogModel(params);
    return await commissionLog.save();
  };
}

const customerCommissionLogService = new CustomerCommissionLogService();

export { customerCommissionLogService };
