import { ErrorHelper, firebaseHelper, UtilsHelper } from "../../../../helpers";
import { Context } from "../../../context";
import { AddressHelper } from "../../address/address.helper";
import { MemberHelper } from "../member.helper";
import { MemberModel } from "../member.model";
import { memberService } from "../member.service";

export default {
  Mutation: {
    signUpMember: async (root: any, args: any, context: Context) => {
      const { password, inviteCode, psid, ...data } = args.data;
      if (!UtilsHelper.isEmail(data.username))
        throw ErrorHelper.createUserError("email không đúng định dạng");
      if (password.length < 6)
        throw ErrorHelper.createUserError("mật khẩu phải có ít nhất 6 ký tự");
      const member = await MemberModel.findOne({ username: data.username });
      if (member) {
        throw ErrorHelper.createUserError("Tên tài khoản này đã tồn tại");
      }
      const fbUser = await firebaseHelper.createUser(data.username, password);
      data.uid = fbUser.uid;
      data.code = await memberService.generateCode();
      data.psids = [psid];
      try {
        if (inviteCode) {
          const parent = await MemberModel.findOne({ code: inviteCode });
          if (parent) {
            data.parentIds = [parent._id];
            data.branchId = parent.branchId;
          }
        }
        const helper = new MemberHelper(new MemberModel(data));
        await Promise.all([
          AddressHelper.setProvinceName(helper.member),
          AddressHelper.setDistrictName(helper.member),
          AddressHelper.setWardName(helper.member),
        ]);
        return {
          member: await helper.member.save(),
          token: helper.getToken(),
        };
      } catch (err) {
        await firebaseHelper.deleteUser(fbUser.uid).catch((err) => {});
        throw err;
      }
    },
  },
};
