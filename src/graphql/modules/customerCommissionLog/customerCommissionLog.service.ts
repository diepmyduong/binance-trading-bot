import { CrudService } from "../../../base/crudService";
import {
  CustomerCommissionLogModel,
  CustomerCommissionLogType
} from "./customerCommissionLog.model";

class CustomerCommissionLogService extends CrudService<typeof CustomerCommissionLogModel> {
  constructor() {
    super(CustomerCommissionLogModel);
  }

  payCustomerCommission = ({ customerId, memberId, id, commission, collaboratorId }: any) => CustomerCommissionLogModel.create({
    customerId,
    memberId,
    type: CustomerCommissionLogType.RECEIVE_COMMISSION_2_FROM_ORDER,
    value: commission,
    orderId: id,
    collaboratorId
  });
};

const customerCommissionLogService = new CustomerCommissionLogService();

export { customerCommissionLogService };
