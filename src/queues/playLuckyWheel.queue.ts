import Queue, { Job } from "bee-queue";
import { Dictionary, random, set } from "lodash";
import moment from "moment";

import { luckyWheelLoader } from "../batch/luckyWheel.loader";
import { configs } from "../configs";
import { Gift } from "../graphql/modules/luckyWheel/gift.graphql";
import { ILuckyWheel, LuckyWheelModel } from "../graphql/modules/luckyWheel/luckyWheel.model";
import { LuckyWheelResultModel } from "../graphql/modules/luckyWheelResult/luckyWheelResult.model";
import { MainConnection } from "../loaders/database";

class PlayLuckyWheelQueue {
  private _queues: Dictionary<Queue> = {};

  private _wheels: Dictionary<{ jobId: string; wheel: ILuckyWheel }> = {};

  queue(id: string) {
    if (!this._queues[id]) {
      this._queues[id] = new Queue("playwheel", {
        prefix: id,
        removeOnSuccess: true,
        removeOnFailure: true,
        redis: {
          host: configs.redis.host,
          port: configs.redis.port,
          password: configs.redis.password,
          prefix: configs.redis.prefix,
        },
      });
      this._queues[id].process(this.process.bind(this));
    }
    return this._queues[id];
  }

  private async process(job: Job<{ customerId: string; wheelId: string }>) {
    if (Date.now() >= job.options.timestamp + 30000) {
      return Promise.reject(new Error("Vui lòng thử lại."));
    }
    const session = await MainConnection.startSession();
    try {
      let result: any = { error: null, data: null };
      await session.withTransaction(async (session) => {
        const key = [job.data.wheelId, job.data.customerId].join("|");

        const [wheel, issuedToDate, issuedToDateByCustomer, issuedByCustomer] = await Promise.all([
          this._wheels[job.data.wheelId] && this._wheels[job.data.wheelId].jobId == job.id
            ? this._wheels[job.data.wheelId].wheel
            : LuckyWheelModel.findById(job.data.wheelId),
          luckyWheelLoader.issuedToDate.load(job.data.wheelId),
          luckyWheelLoader.issuedToDateByCustomer.load(key),
          luckyWheelLoader.issuedByCustomer.load(key),
        ]);
        if (wheel.issueNumber > 0) {
          let issued = 0;
          if (wheel.issueByDate) {
            if (
              wheel.issueByDate &&
              wheel.issuedDate &&
              moment().startOf("days").isBefore(wheel.issuedDate)
            ) {
              issued = wheel.issuedByDate;
            } else {
              issued = issuedToDate;
            }
          } else {
            issued = wheel.issued;
          }
          if (issued >= wheel.issueNumber) {
            result = { error: new Error("Đã hết số lượt tham gia"), data: null };
            return result;
          }
        }
        if (wheel.useLimit > 0) {
          let issued = 0;
          const key = [wheel._id.toString(), job.data.customerId].join("|");
          if (wheel.useLimitByDate) {
            issued = issuedToDateByCustomer;
          } else {
            issued = issuedByCustomer;
          }
          if (issued >= wheel.useLimit) {
            result = { error: new Error("Đã hết số lượt tham gia"), data: null };
            return result;
          }
        }
        const canWin = random(1, 100) <= wheel.successRatio;
        const loseGifts = wheel.gifts.filter((g) => g.isLose);
        const winGifts = wheel.gifts.filter((g) => !g.isLose && g.qty > g.usedQty);
        let gift: Gift;
        if (!canWin) {
          gift = loseGifts[random(0, loseGifts.length - 1)];
        } else {
          let counter = -1;
          const giftRange: any[] = [];
          winGifts.forEach((g) => {
            giftRange.push({ gift: g, r: [counter + 1, counter + (g.qty - g.usedQty)] });
            counter += g.qty - g.usedQty;
          });
          if (counter == -1) gift = loseGifts[random(0, loseGifts.length - 1)];
          else {
            const randomIndex = random(0, counter);
            gift = giftRange.find((g) => g.r[0] <= randomIndex && g.r[1] >= randomIndex).gift;
          }
        }
        const luckyWheelRes = new LuckyWheelResultModel({
          memberId: wheel.memberId,
          customerId: job.data.customerId,
          luckyWheelId: wheel._id,
          code: "",
          gift: gift,
        });
        switch (gift.type) {
          default: {
            luckyWheelRes.code = luckyWheelRes._id;
          }
        }
        const giftIndex = wheel.gifts.findIndex((g) => g._id.toString() == gift._id.toString());
        wheel.issuedByDate += 1;
        wheel.issued += 1;
        wheel.gifts[giftIndex].usedQty += 1;
        wheel.issuedDate = new Date();
        await Promise.all([
          luckyWheelRes.save({ session }),
          wheel
            .updateOne(
              {
                $inc: { issuedByDate: 1, issued: 1, [`gifts.${giftIndex}.usedQty`]: 1 },
                $set: { issuedDate: new Date() },
              },
              { session }
            )
            .exec(),
        ]);
        this._wheels[job.data.wheelId] = { jobId: (parseInt(job.id) + 1).toString(), wheel };
        result = { error: null, data: luckyWheelRes };
      });
      if (result.error) return Promise.reject(result.error);
      else return result.data;
    } catch (err) {
      return Promise.reject(err);
    } finally {
      session.endSession();
    }
  }
}

export const playLuckyWheelQueue = new PlayLuckyWheelQueue();
