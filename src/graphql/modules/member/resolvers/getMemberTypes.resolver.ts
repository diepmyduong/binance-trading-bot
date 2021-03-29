import { SettingKey } from "../../../../configs/settingData";
import { Context } from "../../../context";
import { SettingHelper } from "../../setting/setting.helper";
import { MemberType } from "../member.model";

const Query = {
  getMemberTypes: async (root: any, args: any, context: Context) => {
    const [enabledVNPost, enabledContact] = await SettingHelper.loadMany([
      SettingKey.DELIVERY_ENABLED_VNPOST,
      SettingKey.DELIVERY_ENABLED_CONTACT
    ]);

    const results = [];
    
    results.push({type : MemberType.BRANCH, name:"Bưu cục"});
    results.push({type : MemberType.SALE, name:"Nhân viên"});
    results.push({type : MemberType.AGENCY, name:"Điểm bán"});
      
    return results;
  },
};

export default { Query };
