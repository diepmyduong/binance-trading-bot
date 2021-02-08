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
    return { member: member, token: helper.getToken() };
  },
};

export default { Mutation };
