import { ROLES } from "../../../../constants/role.const";
import { Context } from "../../../context";
import { MemberModel } from "../member.model";
// danh cho admin page
const Mutation = {
  setMemberPSID: async (root: any, args: any, context: Context) => {
    context.auth([ROLES.MEMBER]);
    const { psid } = args;
    const member = await MemberModel.findById(context.id);
    await MemberModel.updateMany({ psids: psid }, { $pull: { psids: psid } });
    return await MemberModel.findOneAndUpdate(
      { _id: member._id },
      { $addToSet: { psids: psid } },
      { new: true }
    );
  },
};

export default { Mutation };
