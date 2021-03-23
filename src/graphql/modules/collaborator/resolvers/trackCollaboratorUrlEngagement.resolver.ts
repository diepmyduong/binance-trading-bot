
import { ErrorHelper } from "../../../../base/error";
import { ROLES } from "../../../../constants/role.const";
import { AuthHelper } from "../../../../helpers";
import { FacebookHelper } from "../../../../helpers/facebook.helper";
import { Context } from "../../../context";
import { MemberModel } from "../../member/member.model";
import { CollaboratorModel } from "../collaborator.model";

const Mutation = {
  trackCollaboratorUrlEngagement: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
    const { id } = args;

    const accessToken = args.accessToken;

    const member = await MemberModel.findById(context.id);
    if (accessToken) {
      member.facebookAccessToken = accessToken;
      await member.save();
    }

    const collaborator = await CollaboratorModel.findById(id);
    if (!collaborator)
      throw ErrorHelper.mgRecoredNotFound("cộng tác viên");

    if (!collaborator.shortUrl)
      throw ErrorHelper.mgRecoredNotFound("link giới thiệu cộng tác viên");

    const engament = await FacebookHelper.getEngagement(collaborator.shortUrl, member.facebookAccessToken);
    if (!engament.success) {
      throw ErrorHelper.tokenExpired();
    }

    return await CollaboratorModel.findByIdAndUpdate(
      collaborator.id,
      {
        $set: {
          likeCount: engament.likeCount,
          shareCount: engament.shareCount,
          commentCount: engament.commentCount
        }
      },
      { new: true }
    );
  }
};

export default {
  Mutation,
};
