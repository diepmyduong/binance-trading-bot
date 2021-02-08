import { CrudService } from "../../../base/crudService";
import { CustomerPointLogModel, CustomerPointLogType, ICustomerPointLog } from "./customerPointLog.model";
const {
  RECEIVE_FROM_ORDER,
  RECEIVE_FROM_REGIS_SMS,
  RECEIVE_FROM_RESIS_SERVICE,
  RECEIVE_FROM_LUCKY_WHEEL
} = CustomerPointLogType;
class CustomerPointLogService extends CrudService<typeof CustomerPointLogModel> {
  constructor() {
    super(CustomerPointLogModel);
  }

  payBonusPoint = async ({ customerId, type, id, value }: any) => {

    let params: any = {
      customerId,
      type,
      value,
    };

    if (type === RECEIVE_FROM_ORDER)
      params.orderId = id;
    if (type === RECEIVE_FROM_REGIS_SMS)
      params.regisSMSId = id;
    if (type === RECEIVE_FROM_RESIS_SERVICE)
      params.regisServiceId = id;
    if (type === RECEIVE_FROM_LUCKY_WHEEL)
      params.luckyWheelResultId = id;

    const pointLog = new CustomerPointLogModel(params);
    return await pointLog.save();
  }
}

const customerPointLogService = new CustomerPointLogService();

export { customerPointLogService };
