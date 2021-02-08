import { Job } from "agenda";
import moment from "moment-timezone";

import { onGivenGifts } from "../../events/onGivenGifts.event";
import { CustomerModel } from "../../graphql/modules/customer/customer.model";
import { CustomerPointLogType } from "../../graphql/modules/customerPointLog/customerPointLog.model";
import { customerPointLogService } from "../../graphql/modules/customerPointLog/customerPointLog.service";
import { EVoucherItemModel } from "../../graphql/modules/eVoucherItem/eVoucherItem.model";
import { LuckyWheelModel, WheelStatus } from "../../graphql/modules/luckyWheel/luckyWheel.model";
import { GiftType, ILuckyWheelGift, LuckyWheelGiftModel } from "../../graphql/modules/luckyWheelGift/luckyWheelGift.model";
import { ILuckyWheelResult, LuckyWheelResultModel, SpinStatus } from "../../graphql/modules/luckyWheelResult/luckyWheelResult.model";
import { Agenda } from "../agenda";

function checkRatioWin(ratioRand: any, limit: any) {
  // idx is a random integer between 0 and 100
  let rate = Math.floor(Math.random() * (limit + 1));
  if (rate >= ratioRand[0] && rate <= ratioRand[1]) {
    return { isWin: true, rate };
  }
  return { isWin: false, rate };
}

async function doWin(randomGift: ILuckyWheelGift, result: ILuckyWheelResult, gifts: any) {

  let evoucherItem = null;
  if (randomGift.type === GiftType.CUMMULATIVE_POINT) {
    result.giftId = randomGift.id;
    result.giftName = randomGift.name;
    result.payPoint = randomGift.payPoint;
    result.giftType = randomGift.type;
    result.status = SpinStatus.WIN;
    randomGift.usedQty = randomGift.usedQty + 1;
  }

  else if (randomGift.type === GiftType.PRESENT) {
    result.giftId = randomGift.id;
    result.giftName = randomGift.name;
    result.giftType = randomGift.type;
    result.status = SpinStatus.WIN;
    randomGift.usedQty = randomGift.usedQty + 1;
  }

  else if (randomGift.type === GiftType.EVOUCHER) {
    result.giftId = randomGift.id;
    result.giftName = randomGift.name;
    result.giftType = randomGift.type;
    result.status = SpinStatus.WIN;
    randomGift.usedQty = randomGift.usedQty + 1;

    evoucherItem = await EVoucherItemModel.findOne({ eVoucherId: randomGift.eVoucherId, activated: false });
    if (!evoucherItem) {
      // console.log('evoucher not found LOSE = ', evoucherItem);
      await doLose(gifts, result);
      return;
    }
    result.eVoucherCode = evoucherItem.code;
    result.eVoucherItemId = evoucherItem.id;
    result.eVoucherId = randomGift.eVoucherId;
  }

  await Promise.all([
    LuckyWheelResultModel.findByIdAndUpdate(result.id, { $set: result }, { new: true }),
    LuckyWheelGiftModel.findByIdAndUpdate(randomGift.id, { $inc: { usedQty: 1 } }, { new: true }),
    evoucherItem && EVoucherItemModel.findByIdAndUpdate(evoucherItem.id, { $set: { activated: true } }, { new: true }),
  ]).then(([savedResult]) => {
    onGivenGifts.next(savedResult);
  });
}

async function doLose(gifts: ILuckyWheelGift[], result: ILuckyWheelResult) {
  const loseGift = gifts.find(g => g.type === GiftType.NOTHING);
  result.giftId = loseGift.id;
  result.giftName = loseGift.name;
  result.status = SpinStatus.LOSE;
  result.giftType = loseGift.type;

  await Promise.all([
    LuckyWheelResultModel.findByIdAndUpdate(result.id, { $set: result }, { new: true }),
    LuckyWheelGiftModel.findByIdAndUpdate(loseGift.id, { $inc: { usedQty: 1 } }, { new: true }),
  ]).then(([savedResult, savedGift]) => {
    onGivenGifts.next(savedResult);
  });
}

async function doBusiness() {
  const luckyWheelResult = await LuckyWheelResultModel.find({ status: SpinStatus.PENDING }).limit(
    1000
  );

  if (luckyWheelResult.length === 0) {
    return;
    // console.log("No record to calculate the lucky wheel `s prize");
  }
  console.log("Execute Job " + LuckyWheelJob.jobName, moment().format());

  // Bắt đầu quét qua từng kết quả SPIN đang PENDING
  for (const result of luckyWheelResult) {
    const { luckyWheelId, customerId, id } = result;

    // lấy ra :
    // Vòng quay nào
    // Danh sách phần thưởng
    // Khách nào quay
    const [luckyWheel, gifts, customer] = await Promise.all([
      LuckyWheelModel.findById(luckyWheelId),
      LuckyWheelGiftModel.find({ luckyWheelId }),
      CustomerModel.findById(customerId),
    ]);

    // lấy ra tỉ lệ trúng
    const { successRatio } = luckyWheel;

    //tính tỉ lệ trúng theo 100%
    const { isWin } = checkRatioWin([0, successRatio], 100);

    // console.log('isWin');

    // nếu trúng :
    if (isWin) {
      const winGifts = gifts
        .filter((gift) => {
          const cond1 = gift.type !== GiftType.NOTHING;
          const cond2 = gift.qty - gift.usedQty > 0;
          return cond1 && cond2;
        })
        .sort((a, b) => a.position - b.position);

      // console.log('winGifts', winGifts);
      if (winGifts.length === 0) {
        // console.log('LOSE -- winGifts.length === 0');
        await doLose(gifts, result);
      } else {
        const newHugeGifts = [];

        for (const gift of winGifts) {
          const remain = gift.qty - gift.usedQty;
          for (let i = 0; i < remain; i++) {
            newHugeGifts.push(gift);
          }
        }
        // console.log('newHugeGifts', newHugeGifts);

        // console.log('winGifts', winGifts);
        // console.log('newHugeGifts', newHugeGifts.length);
        //tính tổng các số lượng quà còn lại trong vòng quay
        const totalRatio = winGifts.reduce((total, { qty, usedQty }) => {
          return total + (qty - usedQty);
        }, 0);
        // console.log('totalRatio', totalRatio);

        if (totalRatio > 0) {
          // lấy ra tỉ lệ mổi phần thưởng sẽ có [1,200] - [201,300] - [301,350]
          const { rate } = checkRatioWin([0, totalRatio - 1], totalRatio - 1);
          // console.log('WIN');
          // console.log('rate', rate);
          const randomGift = newHugeGifts[rate];
          // console.log('WIN -- totalRatio > 0');
          // console.log('randomGift', randomGift);
          await doWin(randomGift, result, gifts);
        }
      }
    }
    else {
      // console.log('LOSE -- ratio rate');
      await doLose(gifts, result);
    }
  }
}

export class LuckyWheelJob {
  static jobName = "Lucky-Wheel";
  static create(data: any) {
    return Agenda.create(this.jobName, data);
  }
  static async execute(job: Job, done: any) {
    await doBusiness();

    return done();
  }
}

export default LuckyWheelJob;

// (async () => {
//   console.log('test businessssssssssssssssssssssss');
//   await doBusiness();
// })();

// gọi hàm ngoài class
// tách nhỏ ra
