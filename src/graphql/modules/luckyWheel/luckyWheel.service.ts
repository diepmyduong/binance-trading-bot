import { Context } from "vm";
import { CrudService } from "../../../base/crudService";
import { LuckyWheelResultModel } from "../luckyWheelResult/luckyWheelResult.model";
import { LuckyWheelModel } from "./luckyWheel.model";
class LuckyWheelService extends CrudService<typeof LuckyWheelModel> {
  constructor() {
    super(LuckyWheelModel);
  }

  getOrderedGiftsByLuckyWheelId(loader: any, idField: string, option: { defaultValue: any } = {} as any) {
    return (root: any, args: any, context: Context) => {
      return root[idField]
        ? loader
          .loadMany(root[idField])
          .then((res: any[]) => res.map((r) => r || option.defaultValue).sort((a, b) => a.position - b.position))
        : undefined;
    };
  }


  getLuckyWheelResultByCutomerId(idField: any, option: { defaultValue: any } = {} as any) {
    return (root: any, args: any, context: Context) => {

      const luckyWheelId = root[idField];

      let params: any = { luckyWheelId };
      if (context.isCustomer()) {
        params.customerId = context.id;
      }

      return luckyWheelId
        ? LuckyWheelResultModel.find(params)
          .then((res: any[]) => res.map((r) => r || option.defaultValue))
        : undefined;
    };
  }
}

const luckyWheelService = new LuckyWheelService();

export { luckyWheelService };
