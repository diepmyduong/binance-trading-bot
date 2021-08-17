import { CrudService } from "../../../../base/crudService";
import { SettingGroupModel } from "./settingGroup.model";
class SettingGroupService extends CrudService {
  constructor() {
    super(SettingGroupModel);
  }
}

const settingGroupService = new SettingGroupService();

export { settingGroupService };
