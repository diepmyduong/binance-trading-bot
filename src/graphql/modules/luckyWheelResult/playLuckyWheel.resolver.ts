import { ErrorHelper } from "../../../base/error";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { Context } from "../../context";
import { LuckyWheelResultModel, SpinStatus } from "./luckyWheelResult.model";
import { LuckyWheelModel } from "../luckyWheel/luckyWheel.model";
import { CustomerModel } from "../customer/customer.model";
import { LuckyWheelHelper } from "../luckyWheel/luckyWheel.helper";
import {
  CustomerPointLogModel,
  CustomerPointLogType,
} from "../customerPointLog/customerPointLog.model";
import { LuckyWheelGiftModel } from "../luckyWheelGift/luckyWheelGift.model";
import { LuckyWheelResultHelper } from "./luckyWheelResult.helper";
const Mutation = {
  playLuckyWheel: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.CUSTOMER]);
    const { luckyWheelId } = args;
    const { sellerId: memberId } = context;

    // console.log('luckyWheelId', luckyWheelId);

    const customerId = context.id;

    const [luckyWheel, customer, LuckyWheelGifts, luckyWheelResults] = await Promise.all([
      LuckyWheelModel.findOne({ _id: luckyWheelId }),
      CustomerModel.findById(customerId),
      LuckyWheelGiftModel.find({ luckyWheelId }),
      LuckyWheelResultModel.find({ luckyWheelId, customerId }),
    ]);

    // console.log('luckyWheel', luckyWheel);
    if (!luckyWheel) throw ErrorHelper.mgRecoredNotFound("Vòng quay");

    // console.log('customer', customer);

    // kiem tra vòng quay có quà không
    if (LuckyWheelGifts.length === 0) throw ErrorHelper.mgRecoredNotFound("Quà của vòng quay.");

    // kiem tra ngày bắt đầu đến chưa ?
    const diffstart = LuckyWheelHelper.diffDate(luckyWheel.startDate, new Date());
    if (diffstart <= 0) throw ErrorHelper.requestDataInvalid(". Chưa đến ngày bắt đầu.");

    // kiem tra kết thúc chưa?
    const diffend = LuckyWheelHelper.diffDate(luckyWheel.endDate, new Date());
    if (diffend > 0) throw ErrorHelper.requestDataInvalid(". Giải thưởng đã kết thúc");

    const code = await LuckyWheelResultHelper.generateCode();
    // luckyWheelId: { type: Schema.Types.ObjectId, ref: "LuckyWheel" }, //mã vòng quay
    const luckyWheelResult = new LuckyWheelResultModel({
      customerId: context.id,
      gamePointUsed: luckyWheel.gamePointRequired,
      memberId,
      status: SpinStatus.PENDING,
      //   agencyType: AgencyType.MOBIFONE,
      luckyWheelId,
      code,
    });

    let customerPointLog = null;

    // if (luckyWheel.limitTimes > 0) {
    //   if (luckyWheelResults.length > 0) {
    //     if (luckyWheel.limitTimes <= luckyWheelResults.length) {
    //       throw ErrorHelper.somethingWentWrong(". Quý khách đã dùng hết số lần quay!");
    //     }
    //   }
    // }

    // nếu có điểm game yêu cầu > 0
    if (luckyWheel.gamePointRequired > 0) {
      if (!customer.cumulativePoint)
        throw ErrorHelper.requestDataInvalid(". Khách hàng không có Điểm tích lủy để quay");

      // kiểm tra qua ngày kết thúc chưa ?
      const gamePointRemain = customer.cumulativePoint - luckyWheel.gamePointRequired;

      if (gamePointRemain < 0) throw ErrorHelper.notEnoughtPoint();

      customerPointLog = new CustomerPointLogModel({
        customerId: customer.id, // Mã thành viên
        value: -luckyWheel.gamePointRequired, // Giá trị
        type: CustomerPointLogType.PAY_TO_PLAY_LUCKY_WHEEL, // Loại sự kiện
        luckyWheelResultId: luckyWheelResult.id, //Mã lịch sử quay vòng quay may mắn
      });

      customer.cumulativePoint = gamePointRemain;
    }

    return await Promise.all([
      luckyWheelResult.save(),
      customer.save(),
      customerPointLog && customerPointLog.save(),
    ]).then((res) => res[0]);
  },
};

export default {
  Mutation,
};
