import { gql } from "apollo-server-express";
import { ROLES } from "../../../constants/role.const";
import { Context } from "../../context";
import { DeviceInfoModel } from "../deviceInfo/deviceInfo.model";

export default {
  schema: gql`
    extend type Mutation {
      staffLogout(deviceId: String!): String
    }
  `,
  resolver: {
    Mutation: {
      staffLogout: async (root: any, args: any, context: Context) => {
        context.auth([ROLES.STAFF]);
        const { deviceId } = args;
        await DeviceInfoModel.remove({ staffId: context.id, deviceId }).exec();
        return "Đã đăng xuất";
      },
    },
  },
};
