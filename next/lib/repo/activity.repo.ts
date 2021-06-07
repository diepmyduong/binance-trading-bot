import { BaseModel, CrudRepository } from "./crud.repo";

export interface Activity extends BaseModel {
  username: string;
  message: string;
}
export class ActivityRepository extends CrudRepository<Activity> {
  apiName: string = "Activity";
  displayName: string = "Hoạt động";
  shortFragment: string = this.parseFragment(`
    id: String
    username: String
    message: String
    createdAt: DateTime
    updatedAt: DateTime
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    username: String
    message: String
    createdAt: DateTime
    updatedAt: DateTime
  `);
}

export const ActivityService = new ActivityRepository();
