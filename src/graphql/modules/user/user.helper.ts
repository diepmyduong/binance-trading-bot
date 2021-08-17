import DataLoader from "dataloader";
import { get, keyBy } from "lodash";
import { Types } from "mongoose";

import { AddressModel } from "../address/address.model";
import { DeviceInfoModel } from "../deviceInfo/deviceInfo.model";
import { NotificationModel } from "../notification/notification.model";
import { IUser } from "./user.model";

export class UserHelper {
  constructor(public user: IUser) {}

  static unseenNotifyLoader = new DataLoader<string, number>(
    (ids: string[]) => {
      return NotificationModel.aggregate([
        {
          $match: {
            userId: { $in: ids.map(Types.ObjectId) },
            seen: false,
          },
        },
        { $group: { _id: "$userId", count: { $sum: 1 } } },
      ])
        .exec()
        .then((list: any[]) => {
          const listByKey = keyBy(list, "_id");
          return ids.map((id) => get(listByKey, `${id}.count`, 0));
        });
    },
    { cache: false } // Bỏ cache
  );
  value() {
    return this.user;
  }
  async setDevice(deviceId: string, deviceToken: string) {
    await DeviceInfoModel.remove({ $or: [{ deviceToken }, { deviceId }] });
    await DeviceInfoModel.create({
      userId: this.user._id,
      deviceId,
      deviceToken,
    });
  }

  async getUnseenNotify() {
    return await UserHelper.unseenNotifyLoader.load(this.user._id.toString());
  }
}
