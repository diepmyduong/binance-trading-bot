import { CrudService } from "../../../base/crudService";
import { NotificationModel } from "./notification.model";

class NotificationService extends CrudService {
  constructor() {
    super(NotificationModel);
  }
}

const notificationService = new NotificationService();

export { notificationService };
