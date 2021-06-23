import { gql } from "apollo-server-express";
import { ROLES } from "../../../constants/role.const";
import { TokenHelper } from "../../../helpers/token.helper";
import { Context } from "../../context";
import { CustomerModel } from "./customer.model";

export default {
  schema: gql`
    extend type Mutation {
      loginCustomerByPhone(phone: String!, name: String): CustomerLoginData
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
        const { phone, name } = args;
        const customer = await CustomerModel.findOneAndUpdate(
          { phone, memberId: context.sellerId },
          { $set: { name } },
          { upsert: true, new: true }
        );
        return {
          customer,
          token: TokenHelper.generateToken({
            role: ROLES.ANONYMOUS,
            _id: customer._id,
            memberId: context.sellerId,
            username: customer.name,
          }),
        };
      },
    },
  },
};
