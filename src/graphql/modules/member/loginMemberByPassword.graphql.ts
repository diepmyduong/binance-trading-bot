import { gql } from "apollo-server-express";
import passwordHash from "password-hash";

import { ROLES } from "../../../constants/role.const";
import { TokenHelper } from "../../../helpers/token.helper";
import { Context } from "../../context";
import { DeviceInfoModel } from "../deviceInfo/deviceInfo.model";
import { MemberModel } from "./member.model";

export default {
  schema: gql`
    extend type Mutation {
      loginMemberByPassword(
        username: String!
        password: String!
        deviceId: String
        deviceToken: String
      ): MemberLoginData
    }
  `,
  resolver: {
    Mutation: {
      loginMemberByPassword: async (root: any, args: any, context: Context) => {
        const { username, password, deviceId, deviceToken } = args;
        const member = await MemberModel.findOne({ username: username });
        if (!member) throw Error("Tên đăng nhập không tồn tại.");
        const passwordValid = passwordHash.verify(password, member.password);
        if (!passwordValid) throw Error("Mật khẩu không đúng.");
        if (deviceId && deviceToken) {
          await DeviceInfoModel.remove({ $or: [{ deviceToken }, { deviceId }] });
          await DeviceInfoModel.create({ memberId: member._id, deviceId, deviceToken });
        }
        return {
          member: member,
          token: TokenHelper.generateToken({
            role: ROLES.MEMBER,
            _id: member._id,
            username: member.username,
            createdAt: new Date(),
          }),
        };
      },
    },
  },
};
