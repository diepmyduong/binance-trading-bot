import { CrudService } from "../../../base/crudService";
import { UserModel } from "./user.model";

class UserService extends CrudService {
  constructor() {
    super(UserModel);
  }
}

const userService = new UserService();

export { userService };
