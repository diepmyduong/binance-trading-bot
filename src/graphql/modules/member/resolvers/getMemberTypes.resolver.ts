import { SettingKey } from "../../../../configs/settingData";
import { Context } from "../../../context";
import { SettingHelper } from "../../setting/setting.helper";
import { MemberType } from "../member.model";

const Query = {
  getMemberTypes: async (root: any, args: any, context: Context) => {
    const [agencyText, saleText, branchText] = await SettingHelper.loadMany([
      SettingKey.MEMBER_TYPE_AGENCY,
      SettingKey.MEMBER_TYPE_SALE,
      SettingKey.MEMBER_TYPE_BRANCH
    ]);

    const results = [];

    results.push({ type: MemberType.BRANCH, name: branchText });
    results.push({ type: MemberType.SALE, name: saleText });
    results.push({ type: MemberType.AGENCY, name: agencyText });

    return results;
  },
};

export default { Query };
