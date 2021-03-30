import { ErrorHelper } from "../../../../base/error";
import { firebaseHelper } from "../../../../helpers";
import { Context } from "../../../context";
import { MemberHelper } from "../member.helper";
import { MemberModel } from "../member.model";

const Mutation = {
  loginMember: async (root: any, args: any, context: Context) => {
    const { idToken } = args;
    let decode = await firebaseHelper.verifyIdToken(idToken);
    const member = await MemberModel.findOne({ uid: decode.uid });
    if (!member) throw ErrorHelper.mgRecoredNotFound("Tài khoản");
    const helper = new MemberHelper(member);

    const token =helper.getToken();

    await MemberModel.findByIdAndUpdate(member.id, {
      $set: {
        xToken: token,
        lastLoginDate: new Date()
      }
    }, { new: true });

    return { member: member, token };
  },
};

export default { Mutation };
