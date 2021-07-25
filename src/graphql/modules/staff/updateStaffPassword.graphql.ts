import { gql } from "apollo-server-express";
import { ROLES } from "../../../constants/role.const";
import { ErrorHelper } from "../../../helpers";
import { Context } from "../../context";
import { StaffModel } from "./staff.model";
import passwordHash from "password-hash";

export default {
  schema: gql`
    extend type Mutation {
      updateStaffPassword(staffId: ID!, password: String!): Staff
    }
  `,
  resolver: {
    Mutation: {
      updateStaffPassword: async (root: any, args: any, context: Context) => {
        let { staffId, password } = args;
        context.auth([ROLES.MEMBER]);
        if (password.length < 6) {
          throw ErrorHelper.updateUserError("mật khẩu phải có ít nhất 6 ký tự");
        }
        const staff = await StaffModel.findById(staffId);
        if (!staff) throw Error("Không tìm thấy nhân viên.");
        if (staff.memberId.toString() != context.sellerId) throw ErrorHelper.permissionDeny();
        staff.password = passwordHash.generate(password);
        return staff.save();
      },
    },
  },
};
