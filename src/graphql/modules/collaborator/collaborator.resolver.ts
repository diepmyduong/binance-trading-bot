import { set } from "lodash";

import { ModelSelectLoader } from "../../../base/baseModel";
import { SettingKey } from "../../../configs/settingData";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper, ErrorHelper, KeycodeHelper } from "../../../helpers";
import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { Context } from "../../context";
import { CustomerLoader } from "../customer/customer.model";
import { IMember, MemberModel } from "../member/member.model";
import { SettingHelper } from "../setting/setting.helper";
import { CollaboratorModel } from "./collaborator.model";
import { collaboratorService } from "./collaborator.service";

const Query = {
  getAllCollaborator: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
    if (context.isMember()) {
      set(args, "q.filter.memberId", context.id);
    }
    return collaboratorService.fetch(args.q);
  },
  getOneCollaborator: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN, ROLES.EDITOR]);
    const { id } = args;
    return await collaboratorService.findOne({ _id: id });
  },
};

const Mutation = {
  createCollaborator: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.MEMBER]);

    const { data } = args;

    const { phone } = data;

    const existedCollaborator = await CollaboratorModel.findOne({
      phone,
      memberId: context.id,
    });

    if (existedCollaborator) throw ErrorHelper.duplicateError("Số điện thoại");

    data.memberId = context.id;

    const host = await SettingHelper.load(SettingKey.WEBAPP_DOMAIN);
    const secret = `${phone}-${context.id}`;

    let shortCode = KeycodeHelper.alpha(secret, 6);
    let shortUrl = `${host}/ctv/${shortCode}`;

    let countShortUrl = await CollaboratorModel.count({ shortUrl });
    while (countShortUrl > 0) {
      shortCode = KeycodeHelper.alpha(secret, 6);
      shortUrl = `${host}/ctv/${shortCode}`;
      countShortUrl = await CollaboratorModel.count({ shortUrl });
    }

    data.shortCode = shortCode;
    data.shortUrl = shortUrl;

    return await collaboratorService.create(data);
  },

  updateCollaborator: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.MEMBER]);
    const { id, data } = args;

    const { phone } = data;

    const existedCollaborator = await CollaboratorModel.findOne({
      phone,
      memberId: context.id,
    });

    if (existedCollaborator.id !== id) throw ErrorHelper.duplicateError("Số điện thoại");

    data.memberId = context.id;

    return await collaboratorService.updateOne(id, data);
  },

  deleteOneCollaborator: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.MEMBER]);
    const { id } = args;
    return await collaboratorService.deleteOne(id);
  },
};
const memberLoader = ModelSelectLoader<IMember>(MemberModel, "id shopName shopLogo fanpageImage");

const Collaborator = {
  member: GraphQLHelper.loadById(memberLoader, "memberId"),
  customer: GraphQLHelper.loadById(CustomerLoader, "customerId"),
};

export default {
  Query,
  Mutation,
  Collaborator,
};
