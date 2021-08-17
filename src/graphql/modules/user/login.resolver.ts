import BaseError from "../../../base/error";
import Firebase from "../../../helpers/firebase";
import Token from "../../../helpers/token";
import { Context } from "../../context";
import { UserHelper } from "./user.helper";
import { UserModel, UserRole } from "./user.model";

const Mutation = {
  login: async (root: any, args: any, context: Context) => {
    const { idToken, deviceId, deviceToken } = args;
    let decode = await Firebase.auth.verifyIdToken(idToken);
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
        throw new BaseError("login-error", "Tài khoản không tồn tại", 404);
      }
    }
    if (deviceId && deviceToken) {
      await new UserHelper(user).setDevice(deviceId, deviceToken);
    }
    const username = user.name || user.email || user.phone || user.role;
    return {
      user,
      token: new Token(user._id, user.role, { username }).sign,
    };
  },
};

export default {
  Mutation,
};
