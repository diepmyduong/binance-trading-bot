import DataLoader from "dataloader";
import { get, keyBy } from "lodash";
import { Types } from "mongoose";

import { ErrorHelper } from "../../../base/error";
import { AddressModel } from "../address/address.model";
import { DeviceInfoModel } from "../deviceInfo/deviceInfo.model";
import { NotificationModel } from "../notification/notification.model";
import { UserSubscriber } from "./loaders/userSubscriber.loader";
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
  async setProvinceName() {
    if (!this.user.provinceId) return this;
    const address = await AddressModel.findOne({ provinceId: this.user.provinceId });
    if (!address) throw ErrorHelper.mgRecoredNotFound("Tỉnh / thành");
    this.user.province = address.province;
    return this;
  }
  async setDistrictName() {
    if (!this.user.districtId) return this;
    const address = await AddressModel.findOne({ districtId: this.user.districtId });
    if (!address) throw ErrorHelper.mgRecoredNotFound("Quận / Huyện");
    this.user.district = address.district;
    return this;
  }
  async setWardName() {
    if (!this.user.wardId) return this;
    const address = await AddressModel.findOne({ wardId: this.user.wardId });
    if (!address) throw ErrorHelper.mgRecoredNotFound("Phường / Xã");
    this.user.ward = address.ward;
    return this;
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
  async getSubscriber() {
    if (!this.user.psid) return;
    return await UserSubscriber.loader.load(this.user.psid);
  }
}
