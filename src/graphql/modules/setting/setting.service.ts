import { CrudService } from "../../../base/crudService";
import { SettingModel } from "./setting.model";
class SettingService extends CrudService {
  constructor() {
    super(SettingModel);
  }
}

const settingService = new SettingService();

export { settingService };
