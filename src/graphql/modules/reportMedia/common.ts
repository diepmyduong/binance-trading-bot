import { set } from "lodash";
import { Types } from "mongoose";
import { Context } from "../../context";
import { MemberModel } from "../member/member.model";

export async function getMatch(context: Context, branchId: any, sellerIds: any) {
  const $match: any = {};
  if (context.isMember()) {
    set($match, "memberId.$in", [Types.ObjectId(context.id)]);
  } else if (branchId) {
    const memberIds = await MemberModel.find({ branchId, activated: true })
      .select("_id")
      .then((res) => res.map((r) => r._id));
    set($match, "memberId.$in", memberIds);
  } else if (sellerIds?.length) {
    set($match, "memberId.$in", sellerIds.map(Types.ObjectId));
  }
  return $match;
}
