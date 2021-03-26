import { CrudService } from "../../../base/crudService";
import { CustomerPointLogModel } from "../customerPointLog/customerPointLog.model";
import {
  CustomerCommissionLogModel,
  CustomerCommissionLogType,
  ICustomerCommissionLog,
} from "./customerCommissionLog.model";

const {
  RECEIVE_COMMISSION_2_FROM_ORDER,
  RETURN_COMMISSION_2_FROM_ORDER_TO_SHOPPER
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
  payCustomerCommission = async ({ customerId, memberId, id, commission }: any) => {
    const params: any = {
      customerId,
      memberId,
      type: RECEIVE_COMMISSION_2_FROM_ORDER,
      value: commission,
      orderId: id
    };
    const commissionLog = new CustomerCommissionLogModel(params);
    return await commissionLog.save();
  };

  payMemberCommission = async ({ memberId, id, commission }: any) => {
    let params: any = {
      returnMemberId: memberId,
      type: RETURN_COMMISSION_2_FROM_ORDER_TO_SHOPPER,
      value: commission,
      orderId: id
    };
    const commissionLog = new CustomerCommissionLogModel(params);
    return await commissionLog.save();
  };
}

const customerCommissionLogService = new CustomerCommissionLogService();

export { customerCommissionLogService };
