import { Subject } from "rxjs";
import { ActivityModel } from "../graphql/modules/activity/activity.model";
export const onActivity = new Subject<{ username: string; message: string }>();

onActivity.subscribe((event) => {
  ActivityModel.create(event);
});
