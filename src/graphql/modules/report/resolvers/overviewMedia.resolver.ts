import { get, set } from "lodash";

import { ROLES } from "../../../../constants/role.const";
import { AuthHelper } from "../../../../helpers";
import { Context } from "../../../context";
import { collaboratorService } from "../../collaborator/collaborator.service";
import { collaboratorProductService } from "../../collaboratorProduct/collaboratorProduct.service";
import { MemberModel } from "../../member/member.model";

//CTV - đường link - lựợt click - lượt like - lượt share - lượt comment - tổng like SP - Tổng share SP - Tổng coment SP - tổng SP - tổng lượng sp đặt hàng thành công
const getCollaboratorsMediaReports = async (root: any, args: any, context: Context) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
  const { branchId, sellerIds } = get(args, "q.filter", {});
  const $match: any = await getMatch(context, branchId, sellerIds);
  set(args, "q.filter", $match);
  return await collaboratorService.fetch(args.q);
};

//sản phẩm - CTV - đường link - lựợt click - lượt like - lượt share - lượt comment - lượng đặt hàng thành công
const getProductsMediaReports = async (root: any, args: any, context: Context) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
  const { branchId, sellerIds } = get(args, "q.filter", {});
  const $match: any = await getMatch(context, branchId, sellerIds);
  set(args, "q.filter", $match);
  return collaboratorProductService.fetch(args.q);
};

const Query = {
  getCollaboratorsMediaReports,
  getProductsMediaReports,
};

export default {
  Query,
};
async function getMatch(context: Context, branchId: any, sellerIds: any) {
  const $match: any = {};
  if (context.isMember()) {
    set($match, "memberId.$in", [context.id]);
  } else if (branchId) {
    const memberIds = await MemberModel.find({ branchId, activated: true })
      .select("_id")
      .then((res) => res.map((r) => r._id));
    set($match, "memberId.$in", memberIds);
  } else if (sellerIds?.length) {
    set($match, "memberId.$in", sellerIds);
  }
  return $match;
}
