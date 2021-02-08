import { ROLES } from "../../../constants/role.const";
import { onActivity } from "../../../events/onActivity.event";
import { AuthHelper } from "../../../helpers";
import { Context } from "../../context";
import { DeviceInfoModel } from "./deviceInfo.model";

const Mutation = {
  regisDevice: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR); // Cấp quyền
    const { deviceToken, deviceId } = args;
    return DeviceInfoModel.findOneAndUpdate(
      { userId: context.tokenData._id },
      { $set: { deviceId: deviceId, deviceToken: deviceToken } },
      { upsert: true, new: true }
    )
      .exec()
      .then((res) => {
        onActivity.next({
          username: context.tokenData.username || "",
          message: `Người dùng đăng ký thiết bị ${res.deviceId}`,
        });
        return res;
      });
  },
};
export default { Mutation };
