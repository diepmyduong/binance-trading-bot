import { ErrorHelper } from "../../../base/error";
import { firebaseHelper } from "../../../helpers/firebase.helper";
import { TokenHelper } from "../../../helpers/token.helper";
import { Context } from "../../context";
import { DeviceInfoModel } from "../deviceInfo/deviceInfo.model";
import { UserHelper } from "./user.helper";
import { UserModel, UserRole } from "./user.model";

const Mutation = {
  login: async (root: any, args: any, context: Context) => {
    const { idToken, deviceId, deviceToken } = args;
    let decode = await firebaseHelper.verifyIdToken(idToken);
    let user = await UserModel.findOne({ uid: decode.uid });
    if (!user) {
      if (decode.email == "admin@gmail.com") {
        user = await UserModel.create({
          uid: decode.uid,
          name: "Admin",
          email: decode.email,
          role: UserRole.ADMIN,
        });
      } else {
        throw ErrorHelper.userNotExist();
      }
    }
    if (deviceId && deviceToken) {
      await new UserHelper(user).setDevice(deviceId, deviceToken);
    }
    return {
      user,
      token: TokenHelper.generateToken({
        role: user.role,
        _id: user._id,
        username: user.name || user.email || user.phone || user.role,
      }),
    };
  },
};

export default {
  Mutation,
};
