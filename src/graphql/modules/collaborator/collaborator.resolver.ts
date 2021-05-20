import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper, ErrorHelper, KeycodeHelper } from "../../../helpers";
import { Context } from "../../context";
import { MemberLoader } from "../member/member.model";
import { CollaboratorModel, ICollaborator } from "./collaborator.model";
import { collaboratorService } from "./collaborator.service";
import { CustomerModel } from "../customer/customer.model";
import { SettingHelper } from "../setting/setting.helper";
import { SettingKey } from "../../../configs/settingData";

const Query = {
  getAllCollaborator: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
    if (context.isMember()) {
      args.q.filter.memberId = context.id;
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

const Collaborator = {
  member: GraphQLHelper.loadById(MemberLoader, "memberId"),
  customer: async (root: ICollaborator, args: any, context: Context) => {
    return await CustomerModel.findOne({ phone: root.phone });
  },
};

export default {
  Query,
  Mutation,
  Collaborator,
};
