import { gql } from "apollo-server-express";
import { random } from "lodash";
import moment from "moment";
import { ErrorHelper } from "../../../base/error";
import { SettingKey } from "../../../configs/settingData";
import { ROLES } from "../../../constants/role.const";
import { UtilsHelper } from "../../../helpers";
import LocalBroker from "../../../services/broker";
import { Context } from "../../context";
import { MemberModel } from "../member/member.model";
import { SettingHelper } from "../setting/setting.helper";
import { ShopConfigModel } from "../shopConfig/shopConfig.model";
import { CustomerModel } from "./customer.model";

export default {
  schema: gql`
    extend type Mutation {
      requestOtp(phone: String!): String
    }
  `,
  resolver: {
    Mutation: {
      requestOtp: async (root: any, args: any, context: Context) => {
        context.auth([ROLES.ANONYMOUS]);
        const { phone } = args;
        const customer = await CustomerModel.findOneAndUpdate(
          { phone, memberId: context.sellerId },
          { $setOnInsert: { name: "Vãng Lai" } },
          { upsert: true, new: true }
        );
        if (customer.otp && moment().isBefore(customer.otpExpired))
          return "Tin nhắn đã được gửi đi.";
        if (customer.otpRetry >= 5 && moment().isBefore(customer.otpRetryExpired))
          return "Vượt quá số lần gửi trong ngày. Vui lòng thử lại sau.";
        if (customer.otpRetry >= 5) customer.otpRetry == 0;
        customer.otpRetry++;
        if (customer.otpRetry >= 5)
          customer.otpRetryExpired = moment().add(1, "days").startOf("date").toDate();
        customer.otp = random(100000, 999999).toString();
        customer.otpExpired = moment().add(60, "seconds").toDate();
        const [shopConfig, smsTemplate, member] = await Promise.all([
          ShopConfigModel.findOne({ memberId: context.sellerId }),
          SettingHelper.load(SettingKey.SMS_OTP),
          MemberModel.findById(context.sellerId),
        ]);
        if (!shopConfig.smsOtp) throw ErrorHelper.permissionDeny();
        const content = UtilsHelper.parseStringWithInfo({
          data: smsTemplate,
          info: {
            SHOP_NAME: member.shopName,
            OTP: customer.otp,
          },
        });
        await LocalBroker.call("ESMS.send", { phone: customer.phone, content });
        await customer.save();
        return "Tin nhắn đã được gửi đi.";
      },
    },
  },
};
