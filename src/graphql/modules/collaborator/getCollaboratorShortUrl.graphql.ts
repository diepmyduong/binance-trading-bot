import { gql } from "apollo-server-express";
import { SettingKey } from "../../../configs/settingData";
import { Context } from "../../context";
import { MemberLoader } from "../member/member.model";
import { SettingHelper } from "../setting/setting.helper";
import { ICollaborator } from "./collaborator.model";

export default {
  schema: gql`
    extend type Collaborator {
      "Đường dẫn giới thiệu"
      shortUrl: String
    }
  `,
  resolver: {
    Collaborator: {
      shortUrl: async (root: ICollaborator, args: any, context: Context) => {
        const [domain, member] = await Promise.all([
          SettingHelper.load(SettingKey.WEBAPP_DOMAIN),
          MemberLoader.load(context.sellerId),
        ]);
        return `${domain}/${member.code}?colCode=${root.shortCode}`;
      },
    },
  },
};
