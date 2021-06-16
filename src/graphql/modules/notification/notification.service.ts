import { CrudService } from "../../../base/crudService";
import { NotificationModel } from "./notification.model";

class NotificationService extends CrudService<typeof NotificationModel> {
  constructor() {
    super(NotificationModel);
  }
}

const notificationService = new NotificationService();

export { notificationService };
