import { set } from "lodash";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { Context } from "../../context";
import { counterService } from "../counter/counter.service";
import { ProductLoader } from "../product/product.model";
import { collaboratorCampaignService } from "./collaboratorCampaign.service";

const Query = {
  getAllCollaboratorCampaign: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ADMIN_EDITOR_CUSTOMER);
    if (context.isCustomer()) {
      set(args, "q.filter.isPublish", true);
    }
    return collaboratorCampaignService.fetch(args.q);
  },
  getOneCollaboratorCampaign: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ADMIN_EDITOR_CUSTOMER);
    const { id } = args;
    return await collaboratorCampaignService.findOne({ _id: id });
  },
};

const Mutation = {
  createCollaboratorCampaign: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ADMIN_EDITOR);
    const { data } = args;
    if (!data.code) {
      data.code = await counterService.trigger("collaboratorCampaign").then((res) => "cdctv" + res);
    }
    return await collaboratorCampaignService.create(data);
  },
  updateCollaboratorCampaign: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ADMIN_EDITOR);
    const { id, data } = args;
    return await collaboratorCampaignService.updateOne(id, data);
  },
  deleteOneCollaboratorCampaign: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ADMIN_EDITOR);
    const { id } = args;
    return await collaboratorCampaignService.deleteOne(id);
  },
};

const CollaboratorCampaign = {
  product: GraphQLHelper.loadById(ProductLoader, "productId"),
};

export default {
  Query,
  Mutation,
  CollaboratorCampaign,
};
