import { gql } from "apollo-server-express";
import moment from "moment-timezone";

import { ErrorHelper } from "../../../base/error";
import { luckyWheelLoader } from "../../../batch/luckyWheel.loader";
import { ROLES } from "../../../constants/role.const";
import LocalBroker from "../../../services/broker";
import { Context } from "../../context";
import { CustomerVoucherModel } from "../customerVoucher/customerVoucher.model";
import { LuckyWheelResultModel } from "../luckyWheelResult/luckyWheelResult.model";
import { GiftType } from "./gift.graphql";
import { LuckyWheelLoader } from "./luckyWheel.model";

export default {
  schema: gql`
    extend type Mutation {
      playLuckyWheel(wheelId: ID!): LuckyWheelResult
    }
  `,
  resolver: {
    Mutation: {
      playLuckyWheel: async (root: any, args: any, context: Context) => {
        context.auth([ROLES.CUSTOMER]);
        const { wheelId } = args;
        const wheel = await LuckyWheelLoader.load(wheelId);
        if (!wheel) throw ErrorHelper.mgRecoredNotFound("Vòng quay");
        if (!wheel.isActive) throw Error("Không thể tham gia vòng quay");
        if (moment().isBefore(wheel.startDate)) throw Error("Chương trình chưa bắt đầu");
        if (moment().isAfter(wheel.endDate)) throw Error("Chương trình đã kết thúc");
        if (wheel.issueNumber > 0) {
          let issued = 0;
          if (
            wheel.issueByDate &&
            wheel.issuedDate &&
            moment().startOf("days").isBefore(wheel.issuedDate)
          ) {
            issued = wheel.issuedByDate;
          } else {
            issued = wheel.issued;
          }
          if (!wheel.issueByDate && wheel.issued >= wheel.issueNumber) {
            throw Error("Đã hết số lượt tham gia");
          }
          if (issued >= wheel.issueNumber) throw Error("Đã hết số lượt tham gia");
        }
        if (wheel.useLimit > 0) {
          const key = [wheel._id.toString(), context.id].join("|");
          let issued = 0;
          if (wheel.useLimitByDate) {
            issued = await luckyWheelLoader.issuedToDateByCustomer.load(key);
          } else {
            issued = await luckyWheelLoader.issuedByCustomer.load(key);
          }
          if (issued >= wheel.useLimit) throw Error("Đã hết số lượt tham gia");
        }
        const result = new LuckyWheelResultModel(
          await LocalBroker.call("luckyWheel.play", {
            wheelId: wheel._id.toString(),
            customerId: context.id,
          })
        );
        switch (result.gift.type) {
          case GiftType.VOUCHER: {
            const customerVoucher = new CustomerVoucherModel(
              await LocalBroker.call("voucher.issueUnlimit", {
                voucherId: result.gift.voucherId.toString(),
                customerId: context.id,
                qty: result.gift.voucherQty,
                expired:
                  result.gift.voucherExpiredDay > 0
                    ? moment().add(result.gift.voucherExpiredDay, "days").endOf("days").toDate()
                    : null,
              })
            );

            result.customerVoucherId = customerVoucher._id;
            await result.updateOne({ $set: { customerVoucherId: customerVoucher._id } });
          }
        }
        return result;
      },
    },
  },
};
