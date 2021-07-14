import { gql } from "apollo-server-express";
import { Context } from "../../context";
import { MemberModel } from "../member/member.model";
import { StaffModel } from "./staff.model";
import passwordHash from "password-hash";
import { TokenHelper } from "../../../helpers/token.helper";
import { ROLES } from "../../../constants/role.const";
import { DeviceInfoModel } from "../deviceInfo/deviceInfo.model";
export default {
  schema: gql`
    extend type Mutation {
      loginStaff(
        memberCode: String!
        username: String!
        password: String!
        deviceId: String
        deviceToken: String
      ): LoginStaffData
    }
    type LoginStaffData {
      staff: Staff
      token: String
    }
  `,
  resolver: {
    Mutation: {
      loginStaff: async (root: any, args: any, context: Context) => {
        const { memberCode, username, password, deviceId, deviceToken } = args;
        const member = await MemberModel.findOne({ code: memberCode });
        if (!member) throw Error("Cửa hàng không đúng.");
        const staff = await StaffModel.findOne({ memberId: member._id, username: username });
        if (!staff) throw Error("Tên đăng nhập không tồn tại.");
        const passwordValid = passwordHash.verify(password, staff.password);
        if (!passwordValid) throw Error("Mật khẩu không đúng.");
        if (deviceId && deviceToken) {
          await DeviceInfoModel.remove({ $or: [{ deviceToken }, { deviceId }] });
          await DeviceInfoModel.create({ staffId: staff._id, deviceId, deviceToken });
        }
        return {
          staff: staff,
          token: TokenHelper.generateToken({
            role: ROLES.STAFF,
            _id: staff._id,
            username: staff.name || staff.username,
            memberId: staff.memberId,
            createdAt: new Date(),
          }),
        };
      },
    },
  },
};
