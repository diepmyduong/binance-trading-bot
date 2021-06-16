import { gql } from "apollo-server-express";
import { SettingKey } from "../../../configs/settingData";
import { UtilsHelper } from "../../../helpers";
import { Context } from "../../context";
import { SettingHelper } from "../setting/setting.helper";
import { ICollaboratorCampaign } from "./collaboratorCampaign.model";

export default {
  // schema: gql``,
  resolver: {
    CollaboratorCampaign: {
      content: async (root: ICollaboratorCampaign, args: any, context: Context) => {
        if (context.isCustomer()) {
          const host = await SettingHelper.load(SettingKey.WEBAPP_DOMAIN);
          const link = `${host}/cdctv/${root.code}-${context.collaboratorId}`;
          return UtilsHelper.parseStringWithInfo({
            data: root.content,
            info: { LINK_AFFILIATE: link },
          });
        }
        return root.content;
      },
    },
  },
};
