import { ROLES } from "../../../../constants/role.const";
import { ErrorHelper } from "../../../../helpers";
import { Context } from "../../../context";
import { UserModel } from "../user.model";

const Mutation = {
  setUserPSID: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ADMIN_EDITOR);
    const { psid, userId } = args;
    const user = await UserModel.findById(userId);
    if (!user) throw ErrorHelper.mgRecoredNotFound("Tài khoản");
    await UserModel.updateMany({ psid }, { $unset: { psid: 1 } });
    return await UserModel.findOneAndUpdate({ _id: user._id }, { $set: { psid } }, { new: true });
  },
};

export default { Mutation };
