import { gql } from "apollo-server-express";
import moment from "moment-timezone";

import { ROLES } from "../../../constants/role.const";
import { TokenHelper } from "../../../helpers/token.helper";
import { Context } from "../../context";
import { DeviceInfoModel } from "../deviceInfo/deviceInfo.model";
import { ShopConfigModel } from "../shopConfig/shopConfig.model";
import { CustomerModel } from "./customer.model";

export default {
  schema: gql`
    extend type Mutation {
      loginCustomerByPhone(
        phone: String!
        otp: String
        deviceId: String
        deviceToken: String
      ): CustomerLoginData
    }
    type CustomerLoginData {
      customer: Customer
      token: String
    }
  `,
  resolver: {
    Mutation: {
      loginCustomerByPhone: async (root: any, args: any, context: Context) => {
        context.auth([ROLES.ANONYMOUS]);
        const { phone, otp, deviceId, deviceToken } = args;
        const customer = await CustomerModel.findOneAndUpdate(
          { phone, memberId: context.sellerId },
          { $setOnInsert: { name: "Vãng Lai" } },
          { upsert: true, new: true }
        );
        const [shopConfig] = await Promise.all([
          ShopConfigModel.findOne({ memberId: context.sellerId }),
        ]);
        if (shopConfig.smsOtp) {
          if (!otp || customer.otp != otp) throw Error("Mã pin đăng nhập không đúng.");
          if (moment().isAfter(moment(customer.otpExpired).add(5, "minute")))
            throw Error("Mã pin đã hết hạn");
          await customer
            .update({
              $unset: { otp: 1, otpExpired: 1, otpRetryExpired: 1 },
              $set: { otpRetry: 0 },
            })
            .exec();
        }
        if (deviceId && deviceToken) {
          await DeviceInfoModel.remove({
            $or: [{ deviceToken }, { deviceId }],
          });
          await DeviceInfoModel.create({ customerId: customer._id, deviceId, deviceToken });
        }
        return {
          customer,
          token: TokenHelper.getCustomerToken(customer),
        };
      },
    },
  },
};
