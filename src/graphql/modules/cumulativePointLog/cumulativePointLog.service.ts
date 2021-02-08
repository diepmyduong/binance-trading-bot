import { CrudService } from "../../../base/crudService";
import { CumulativePointLogModel, CumulativePointLogType } from "./cumulativePointLog.model";

const {
  RECEIVE_FROM_ORDER,
  RECEIVE_FROM_REGIS_SMS,
  RECEIVE_FROM_RESIS_SERVICE
} = CumulativePointLogType;

class CumulativePointLogService extends CrudService<typeof CumulativePointLogModel> {
  constructor() {
    super(CumulativePointLogModel);
  }

  note = (type: string) => {
    switch (type) {
      case CumulativePointLogType.RECEIVE_FROM_ORDER:
        return "Nhận từ đơn hàng";
      case CumulativePointLogType.RECEIVE_FROM_INVITE:
        return "Nhận từ mời thành viên";
      case CumulativePointLogType.RECEIVE_FROM_RESIS_SERVICE:
        return "Nhận từ đăng ký dịch vụ";
      case CumulativePointLogType.RECEIVE_FROM_REGIS_SMS:
        return "Nhận từ đăng ký SMS";
      default:
        return "";
    }
  }

  payBonusPoint = async ({ memberId, type, id, value, fromMemberId }: any) => {

    let params: any = {
      memberId,
      type,
      value,
      fromMemberId
    };

    if (type === RECEIVE_FROM_ORDER) {
      params.orderId = id;
      // params.note = this.note(RECEIVE_FROM_ORDER);
    }
    if (type === RECEIVE_FROM_REGIS_SMS) {
      params.regisSMSId = id;
      // params.note = this.note(RECEIVE_FROM_ORDER);
    }
    if (type === RECEIVE_FROM_RESIS_SERVICE) {
      params.regisServiceId = id;
      // params.note = this.note(RECEIVE_FROM_ORDER);
    }

    const pointLog = new CumulativePointLogModel(params);
    return await pointLog.save();
  }
}

const cumulativePointLogService = new CumulativePointLogService();

export { cumulativePointLogService };
