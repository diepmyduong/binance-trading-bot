import { CrudService } from "../../../base/crudService";
import { CommissionLogModel } from "./commissionLog.model";

class CommissionLogService extends CrudService<typeof CommissionLogModel> {
  constructor() {
    super(CommissionLogModel);
  }

  payOneCommission = async ({ memberId, id, type, commission }: any) => {
    let params: any = {
      memberId,
      type,
      value: commission,
      orderId: id
    };

    const commissionLog = new CommissionLogModel(params);
    return await commissionLog.save();
  }
}

const commissionLogService = new CommissionLogService();



export { commissionLogService };
