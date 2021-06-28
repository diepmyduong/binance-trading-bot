import { set } from "lodash";

import { ROLES } from "../../../constants/role.const";
import { ErrorHelper } from "../../../helpers";
import { Context } from "../../context";
import { ShopCommentModel } from "./shopComment.model";
import { shopCommentService } from "./shopComment.service";

const Query = {
  getAllShopComment: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ANONYMOUS_CUSTOMER_MEMBER_STAFF);
    set(args, "q.filter.memberId", context.sellerId);
    return shopCommentService.fetch(args.q);
  },
  getOneShopComment: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ANONYMOUS_CUSTOMER_MEMBER_STAFF);
    const { id } = args;
    return await shopCommentService.findOne({ _id: id });
  },
};

const Mutation = {
  createShopComment: async (root: any, args: any, context: Context) => {
    context.auth([ROLES.MEMBER]);
    const { data } = args;
    data.memberId = context.sellerId;
    return await shopCommentService.create(data);
  },
  updateShopComment: async (root: any, args: any, context: Context) => {
    context.auth([ROLES.MEMBER]);
    const { id, data } = args;
    await protectDoc(id, context);
    return await shopCommentService.updateOne(id, data);
  },
  deleteOneShopComment: async (root: any, args: any, context: Context) => {
    context.auth([ROLES.MEMBER]);
    const { id } = args;
    await protectDoc(id, context);
    return await shopCommentService.deleteOne(id);
  },
};

const ShopComment = {};

export default {
  Query,
  Mutation,
  ShopComment,
};

async function protectDoc(id: any, context: Context) {
  const item = await ShopCommentModel.findById(id);
  if (item.memberId.toString() != context.id) throw ErrorHelper.permissionDeny();
}
